import { getCustomer } from "@/lib/queries/getCustomer";
import { getTicket } from "@/lib/queries/getTicket";
import { BackButton } from "@/components/BackButton";
import * as Sentry from '@sentry/nextjs';
import TicketForm from "./TicketForm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {Users, init as kindeInit} from '@kinde/management-api-js'

export async function generateMetadata({searchParams,
}: {
    searchParams: Promise<{[key:string]: string | undefined}>
}){
    const {customerId, ticketId} = await searchParams

    if(!customerId && !ticketId) return {
        title: 'Missing Ticket ID or CustomerID'
    }
    if(customerId) return {
        title: `New Ticket for Customer #${customerId}`
    }
    if(ticketId) return {
        title: `Edit Ticket #${ticketId}`
    }
}
export default async function TicketFormPage({
    searchParams,
}: {
    searchParams: Promise<{[key:string]: string | undefined}>
}) {
   try{
        const {customerId, ticketId} = await searchParams
        //Receiving customerId means we're creating a new ticket, 
        //receiving a ticketId means editing a ticket

        if(!customerId && !ticketId){
            return(
                <>
                <h2 className="text-2xl mb-2">
                    Ticket ID or Customer ID required to load ticket form
                </h2>
                <BackButton title="Go Back" />
                </>
            )
        }

        const {getPermission, getUser} = getKindeServerSession()
        const [managerPermission, user] = await Promise.all([
            getPermission('manager'),
            getUser(),
        ])
        const isManager = managerPermission?.isGranted
        //new ticket form
        
        if(customerId){
            const customer = await getCustomer(parseInt(customerId))
            //If the received id doesn't have a customer
            if(!customer){
                return(
                    <>
                    <h2 className="text-2xl mb-2">
                        Customer ID #{customerId} not found
                    </h2>
                    <BackButton title="Go Back" />
                    </>
                )
            }
            if(!customer.active){
                return(
                    <>
                    <h2 className="text-2xl mb-2">
                        Customer ID #{customerId} is not active
                    </h2>
                    <BackButton title="Go Back" />
                    </>
                )
            }
            if(isManager){
                kindeInit() //Kinde management api
                const {users} = await Users.getUsers()
                const techs = users ? users.map(user => ({id: user.email!,
                    description: user.email!
                })) : []
                return <TicketForm customer={customer} techs={techs} isManager={isManager} />
            } else{
                return <TicketForm customer={customer} />
            }
        } 

        if(ticketId){
            const ticket = await getTicket(parseInt(ticketId))
            
            if(!ticket){
                return(
                    <>
                    <h2 className="text-2xl mb-2">
                        Ticket ID not found
                    </h2>
                    <BackButton title="Go Back" />
                    </>
                )
            }

            const customer = await getCustomer(ticket.customerId)

            //return ticket form
            
           /*  console.log('ticket:', ticket)
            console.log('customer:', customer) */
            if(isManager){
                kindeInit() //Kinde management api
                const {users} = await Users.getUsers()
                const techs = users ? users.map(user => ({id: user.email?.toLowerCase()!,
                    description: user.email?.toLowerCase()!
                })) : []
                return <TicketForm customer={customer} ticket={ticket} techs={techs} isManager={isManager} />
            } else{
                const isEditable = user.email?.toLowerCase() === ticket.tech.toLowerCase()
                console.log('user email: ', user.email)
                console.log('tech: ', ticket.tech)
                return <TicketForm customer={customer} ticket={ticket} isEditable={isEditable} />
            }
           

        }
   }
   catch(e){
    if(e instanceof Error){
        Sentry.captureException(e)
        throw e
    }
}
}