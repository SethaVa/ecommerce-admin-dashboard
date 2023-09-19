"use client"
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Trash } from 'lucide-react';
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";

interface SettingsFormProps {
    initialData: any
}

const formSchema = z.object({
    name: z.string().min(1),
  });

  type SettingsFormValues = z.infer<typeof formSchema>
export const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();

  const [formData, setFormData] = React.useState(initialData);

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  })

  const onSubmit = async (data: SettingsFormValues) => {
    try {
        setIsLoading(true);
        await axios.patch(`/api/stores/${params.storeId}`, data);
        router.refresh();
        toast.success("Store updated.")
    } catch (error) {
        toast.error("Something went wrong.")
    }finally{
        setIsLoading(false);
    }
  }

  const onDelete = async () => {
    try {
        setIsLoading(true);
        await axios.delete(`/api/stores/${params.storeId}`);
        router.refresh();
        toast.success("Store t deleted.")
    } catch (error) {
        toast.error("Something went wrong.")
    }finally{
        setIsLoading(false)
    }
  }

  return (
    <>
        <AlertModal 
            isOpen={open}
            isLoading={isLoading}
            onClose={() =>  setOpen(false)}
            onConfirm={() => onDelete()}
        />
        <div className="flex items-center justify-between">
            <Heading title="Store settings" description="Manage store preference" />
            <Button
                disabled={isLoading}
                variant="destructive"
                size="sm"
                onClick={() => setOpen(true)}
            >
                <Trash className="h-4 w-4"/>
            </Button>
        </div>
        <Separator />
        <Form {...form}>
            <form className="space-y-8 w-full" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-3 gap-8">
                    <FormField
                        name="name"
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={isLoading} placeholder="Store name..." {...field}></Input>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    ></FormField>
                </div>
                <Button className="ml-auto" disabled={isLoading} type="submit">
                  Save changes
                </Button>
            </form>
        </Form>
        <Separator />
        <ApiAlert 
            title="NEXT_PUBLIC_API_URL"
            description={`${origin}/api/${params.storeId}`}
            variant="public"
        />                    
    </>
  )
}