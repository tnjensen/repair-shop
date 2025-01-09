import { getCustomer } from "@/lib/queries/getCustomer";
import { BackButton } from "@/components/BackButton";
import * as Sentry from '@sentry/nextjs';
import CustomerForm from "./CustomerForm";

export async function generateMetadata({ 
    searchParams,
}: {
    searchParams: Promise<{[key:string]: string | undefined}>
}){
    const {customerId} = await searchParams

    if(!customerId) return {title: "New Customer"}

    return {title: `Edit Customer #${customerId}`}
}

export default async function CustomerFormPage({
    searchParams,
}: {
    searchParams: Promise<{[key:string]: string | undefined}>
}) {
    try{
        const {customerId} = await searchParams

        //edit customer form
        if(customerId){
            const customer = await getCustomer(parseInt(customerId))

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
            console.log(customer)
            //populate edit form
            return <CustomerForm customer={customer} />
        } else{
            //new customer form component
            return <CustomerForm />
        }
    }
    catch(e){
        if(e instanceof Error){
            Sentry.captureException(e)
            throw e
        }
    }
}