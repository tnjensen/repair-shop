"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InPutWithLabel } from "@/components/inputs/InputWithLabel";
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";
import { TextareaWithLabel } from "@/components/inputs/TextareaWithLabel";
import { CheckboxWithLabel } from "@/components/inputs/CheckBoxWithLabel";
import { StatesArray } from "@/constants/StatesArray";
import {
  insertCustomerSchema,
  type insertCustomerSchemaType,
  type selectCustomerSchemaType,
} from "@/zod-schemas/customer";
import {useAction} from 'next-safe-action/hooks'
import { saveCustomerAction } from "@/app/actions/saveCustomerAction";
import { useToast } from "@/hooks/use-toast";
import { LoaderCircle } from "lucide-react";
import { DisplayServerActionResponse } from "@/components/DisplayServerActionResponse";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

type Props = {
  customer?: selectCustomerSchemaType;
  isManager?: boolean | undefined 
};

export default function CustomerForm({ customer, isManager = false }: Props) {
  const {toast} = useToast()
  const searchParams = useSearchParams()
  const hasCustomerId = searchParams.has('customerId')
  /* const permObj = getPermissions()
  const isAuthorized = !isLoading && permObj.permissions.some(perm => perm === 'manager' || 'admin') */
  const emptyValues : insertCustomerSchemaType = {
    id: 0,
    firstName: "",
    lastName:  "",
    address1:  "",
    address2:  "",
    city: "",
    state:  "",
    zip: "",
    phone:  "",
    email:  "",
    notes:  "",
    active: true,
  } 
  
  const defaultValues: insertCustomerSchemaType = hasCustomerId ? {
    id: customer?.id || 0,
    firstName: customer?.firstName || "",
    lastName: customer?.lastName || "",
    address1: customer?.address1 || "",
    address2: customer?.address2 || "",
    city: customer?.city || "",
    state: customer?.state || "",
    zip: customer?.zip || "",
    phone: customer?.phone || "",
    email: customer?.email || "",
    notes: customer?.notes || "",
    active: customer?.active || true,
  } : emptyValues;

  const form = useForm<insertCustomerSchemaType>({
    mode: "onBlur", // gives the user instant feedback about errors when they tab out
    resolver: zodResolver(insertCustomerSchema),
    defaultValues,
  });

  useEffect(() =>{
    form.reset(hasCustomerId ? defaultValues : emptyValues)
  }, [searchParams.get('customerId')]) // eslint-disable-line react-hooks/exhaustive-deps

  const {
    execute: executeSave,
    result: saveResult,
    isPending: isSaving,
    reset: resetSaveAction
  } = useAction(saveCustomerAction, {
      onSuccess({data}){
        if(data?.message){
          toast({
            variant: 'default',
            title: 'Success! 👏',
            description: data?.message
          })
        }
      },
      onError({error}){
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Save Failed'
        })
      }
  })

  async function submitForm(data: insertCustomerSchemaType) {
    /* console.log(data); */
    /* executeSave(data) */
    executeSave(data)
  }

  return (
    <div className="flex flex-col gap-1 sm:px-8">
      <DisplayServerActionResponse result={saveResult} />
      <div>
        <h2 className="text-2xl font-bold">
          {customer?.id ? "Edit" : "New"} Customer{" "}
          {customer?.id ? `#${customer.id}` : "Form"}
        </h2>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className="flex flex-col md:flex-row gap-4 md:gap-8"
        >
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <InPutWithLabel<insertCustomerSchemaType>
              fieldTitle="First Name"
              nameInSchema="firstName"
            />
            <InPutWithLabel<insertCustomerSchemaType>
              fieldTitle="Last Name"
              nameInSchema="lastName"
            />
            <InPutWithLabel<insertCustomerSchemaType>
              fieldTitle="Address1"
              nameInSchema="address1"
            />
            <InPutWithLabel<insertCustomerSchemaType>
              fieldTitle="Address2"
              nameInSchema="address2"
            />
            <InPutWithLabel<insertCustomerSchemaType>
              fieldTitle="City"
              nameInSchema="city"
            />
            <SelectWithLabel
              fieldTitle="State"
              nameInSchema="state"
              data={StatesArray}
            />
          </div>

          <div className="flex flex-col gap-4 w-full max-w-xs">
            <InPutWithLabel<insertCustomerSchemaType>
              fieldTitle="Zip Code"
              nameInSchema="zip"
            />
            <InPutWithLabel<insertCustomerSchemaType>
              fieldTitle="Email"
              nameInSchema="email"
            />
            <InPutWithLabel<insertCustomerSchemaType>
              fieldTitle="Phone"
              nameInSchema="phone"
            />
            <TextareaWithLabel<insertCustomerSchemaType>
              fieldTitle="Notes"
              nameInSchema="notes"
              className="h-40"
            />

            {isManager && customer?.id ? (
              <CheckboxWithLabel<insertCustomerSchemaType>
                fieldTitle="Active"
                nameInSchema="active"
                message="Yes"
              />
            ) : null}

            <div className="flex gap-2">
              <Button
                type="submit"
                className="w-3/4"
                variant="default"
                title="Save"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                  <LoaderCircle className="animate-spin" />
                  Saving
                  </>
                ): "Save"}
              </Button>
              <Button
                type="submit"
                variant="destructive"
                onClick={() => {
                  form.reset(defaultValues)
                  resetSaveAction()
                }}
                title="Reset"
              >
                Reset
              </Button>
            </div>
          </div>
          {/* <p>{JSON.stringify(form.getValues())}</p> */}
        </form>
      </Form>
    </div>
  );
}
