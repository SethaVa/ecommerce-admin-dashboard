"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { useParams, useRouter } from "next/navigation"
import React, { useState } from "react"
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SelectContent } from "@radix-ui/react-select"
import { AlertModal } from "@/components/modals/alert-modal"
import { toast } from "react-hot-toast"
import axios from "axios"

interface CategoryFormProps{
    initialData: any | null,
    billboards: any
}

const formSchema = z.object({
    name: z.string().min(2),
    billboardId: z.string().min(1)
})

type CategoryFormValues = z.infer<typeof formSchema>

export const CategoryForm: React.FC<CategoryFormProps> = ({
    initialData,
    billboards
}) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData? "Edit category": "Create category";
    const description = initialData? "Edit a category": "Add a new category";
    const toastMessage = initialData? "Category updated.": "Category created.";
    const action = initialData? "Save changes": "Create";

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            billboardId: ""
        }
    })

    const onSubmit = async (data: CategoryFormValues) => {
        try {
            setLoading(true);
            if(initialData){
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data);
            }else{
                await axios.post(`/api/${params.storeId}/categories`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/categories`)
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
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);
            router.refresh();
            router.push(`/${params.storeId}/categories`);
            toast.success("Category deleted.")
        } catch (error) {
            toast.error("Make sure you removed all products using this category first.")
        }finally{
            setLoading(false);
            setOpen(false);
        }
    }
    return (
        <>
            <AlertModal
                isOpen={open} 
                isLoading={loading}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
            />
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
                {
                    initialData && (
                        <Button
                            disabled={loading}
                            variant="destructive"
                            size="sm"
                            onClick={() => setOpen(true)}
                        >
                            <Trash className="w-4 h-4" />
                        </Button>
                    )
                }
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="md:grid md:grid-cols-3 gap-8">
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input 
                                            disabled={loading}
                                            placeholder="Category name"
                                            {...field}          
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="billboardId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Billboard</FormLabel>
                                    <Select
                                        disabled={loading}
                                        value={field.value}
                                        defaultValue={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select a billboard" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                billboards.map((billboard: any) => (
                                                    <SelectItem key={billboard.id} value={billboard.id}>{billboard.label}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button className="ml-auto" type="submit" disabled={loading}>
                        {action}
                    </Button>
                </form>
            </Form>   
        </>
    )
}