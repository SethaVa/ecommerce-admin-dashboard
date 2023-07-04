"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const formSchema = z.object({
    name: z.string().min(1),
  });

export const StoreModal = () => {
    const storeModal = useStoreModal();

    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
        },
      })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true);
            const response = await axios.post('/api/stores', values);
            toast.success("Store created")
        } catch (error) {
            toast.error("Something went wrong")
        } finally{
            setIsLoading(false)
        }
    }

    return (
        <Modal
            title="Create store"
            description="Add a new store to manage products and categories"
            onClose={storeModal.onClose}
            isOpen={storeModal.isOpen}
        >
            <div>
                <div className="pb-4 space-y-4 py-2">
                    <div className="space-y-2">
                        <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input disabled={isLoading} placeholder="E-Commerce" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                <Button disabled={isLoading} variant={"outline"} onClick={storeModal.onClose}>Cancel</Button>
                                <Button disabled={isLoading} type="submit">Continue</Button>
                            </div>
                        </form>
                        </Form>
                    </div>
                </div>
            </div>
        </Modal>
    )
}