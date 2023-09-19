"use client"

import React, { useEffect, useState } from "react";
import { BillboardColumn } from "./columns";
import { Alert } from "@/components/ui/alert";
import { AlertModal } from "@/components/modals/alert-modal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";

interface CellActionProps {
    data: BillboardColumn
}
export const CellAction: React.FC<CellActionProps> = ({
    data
}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const params = useParams()

    const onConfirm = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/billboards/${data.id}`);
            toast.success("Billboard deleted.")
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong.")
        } finally{
            setLoading(false);
        }
    }

    const onCopy = (description: string) => {
        navigator.clipboard.writeText(description);
        toast.success("Billboard ID copied to clipboard.");
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                isLoading={loading}
                onConfirm={onConfirm}
            />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => onCopy(data.id)}
                        >
                            <Copy className="h-4 w-4 mr-2" /> Copy Id
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => router.push(`/${params.storeId}/billboards/${data.id}`)}
                        >
                            <Edit className="mr-2 h-4 w-4" /> Update
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setOpen(true)}
                        >
                            <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
        </>
    )
}