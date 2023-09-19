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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AlertModal } from "@/components/modals/alert-modal"
import { toast } from "react-hot-toast"
import axios from "axios"

import { PrismaClient } from '@prisma/client';
import ImageUpload from "@/components/ui/image-upload"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface ProductFormProps{
    initialData: any,
    categories: any,
    colors: any,
    sizes: any
}

const formSchema = z.object({
    name: z.string().min(1),
    price: z.coerce.number().min(1),
    images: z.object({url: z.string()}).array(),
    categoryId: z.string().min(1),
    colorId: z.string().min(1),
    sizeId: z.string().min(1),
    isArchived: z.boolean().default(false).optional(),
    isFeatured: z.boolean().default(false).optional()
})

type ProductFormValues = z.infer<typeof formSchema>

export const ProductForm: React.FC<ProductFormProps> = ({
    initialData,
    categories,
    colors,
    sizes
}) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData? "Edit product": "Create product";
    const description = initialData? "Edit a product": "Add a new product";
    const toastMessage = initialData? "Product updated.": "Product created.";
    const action = initialData? "Save changes": "Create";

    const defaultValues = initialData ? {
        ...initialData,
        price: parseFloat(String(initialData?.price))
    }:{
        name: "",
        images: [],
        price: 0,
        categoryId: "",
        colorId: "",
        sizeId: "",
        isArchived: false,
        isFeatured: false
    }

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues
    })

    const onSubmit = async (data: ProductFormValues) => {
        try {
            setLoading(true);
            if(initialData){
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data);
            }else{
                await axios.post(`/api/${params.storeId}/products`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/products`)
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
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
            router.refresh();
            router.push(`/${params.storeId}/products`);
            toast.success("Product deleted.")
        } catch (error) {
            toast.error("Something went wrong.")
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
                    <FormField 
                        control={form.control}
                        name="images"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Images</FormLabel>
                                <FormControl>
                                    <ImageUpload 
                                        value={field.value.map((image) => image.url)}
                                        disabled={loading}
                                        onChange={(url) => field.onChange([...field.value, {url}])}
                                        onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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
                                            placeholder="Product name"
                                            {...field}          
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="price"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            disabled={loading}
                                            placeholder="9.99"
                                            {...field}          
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="categoryId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <FormControl>
                                        <Select
                                            disabled={loading}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    categories.map((category: any) => (
                                                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="sizeId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Size</FormLabel>
                                    <FormControl>
                                        <Select
                                            disabled={loading}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} placeholder="Select a size" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    sizes.map((size: any) => (
                                                        <SelectItem key={size.id} value={size.id}>{size.name}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="colorId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Color</FormLabel>
                                    <FormControl>
                                        <Select
                                            disabled={loading}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} placeholder="Select a color" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    colors.map((color: any) => (
                                                        <SelectItem key={color.id} value={color.id}>{color.name}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="isFeatured"
                            render={({field}) => (
                                <FormItem className="flex items-start border rounded-md flex-row space-x-3 space-y-0 p-4">
                                    <FormControl>
                                        <Checkbox 
                                            checked={field.value}
                                            // @ts-ignore
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Feature</FormLabel>
                                        <FormDescription>This product will appear on the home page</FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="isArchived"
                            render={({field}) => (
                                <FormItem className="flex items-start border rounded-md flex-row space-x-3 space-y-0 p-4">
                                    <FormControl>
                                        <Checkbox 
                                            checked={field.value}
                                            // @ts-ignore
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Archived</FormLabel>
                                        <FormDescription>This product will not appear anywhere in the store.</FormDescription>
                                    </div>
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