"use client"

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import React, { useState } from "react";
import { Trash } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";

interface BillboardFormProps{
    initialData: any
}

const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1)
})

type BillboardFormValue = z.infer<typeof formSchema>

export const BillboardForm: React.FC<BillboardFormProps> = ({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData? "Edit billboard": "Create billboard";
    const description = initialData? "Edit a billboard." : "Create a new billboard.";
    const toastMessage = initialData? "Billboard updated." : "Billboard created.";
    const action = initialData? "Save changes": "Create";

    const form = useForm<BillboardFormValue>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: "",
            imageUrl: ""
        }
    })

    const onSubmit = async (data: BillboardFormValue) => {
        try {
            setLoading(true);
            if(initialData){
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);
            }else{
                await axios.post(`/api/${params.storeId}/billboards`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/billboards`);
            toast.success(toastMessage);
        } catch (error) {
            toast.error("Something went wrong.")
        }finally{
            setLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
            router.refresh();
            router.push(`/${params.storeId}/billboards`);
            toast.success("Billboard deleted.")
        } catch (error) {
            toast.error("Make sure you delete all categories using this billboard first.")
        }finally{
            setLoading(false)
        }
    }

    return (
        <>
            <AlertModal 
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                isLoading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
                {
                    initialData && (
                        <Button
                            disabled={loading}
                            variant="destructive"
                            size="sm"
                            onClick={() => setOpen(false)}
                        >
                            <Trash className="w-4 h-4" />
                        </Button>
                    )
                }
            </div>
            <Separator />
            <Form {...form}>
                <form className="w-full space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField 
                        control={form.control}
                        name="imageUrl"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Background image</FormLabel>
                                <FormControl>
                                    <ImageUpload 
                                        value={field.value? [field.value]: []}
                                        disabled={loading}
                                        onChange={(url) => field.onChange(url)}
                                        onRemove={() => field.onChange('')}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="md:grid md:grid-cols-3 gap-8">
                        <FormField 
                            control={form.control}
                            name="label"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Billboard label" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        ></FormField>
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    )
}