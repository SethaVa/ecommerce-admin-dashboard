"use client"

import React from "react"
import { SizeColumn, columns } from "./columns"
import { useParams, useRouter } from "next/navigation"
import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { ApiList } from "@/components/ui/api-list"
import { DataTable } from "@/components/ui/data.table"

interface ColorsClientProps{
    data: SizeColumn[]
}

export const ColorsClient: React.FC<ColorsClientProps> = ({
    data
}) => {
    const params = useParams();
    const router = useRouter();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Colors (${data.length})`} description="Manage colors for your products" />
                <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
                    <Plus className="w-4 h-4 mr-2" /> Add New
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="name" columns={columns} data={data} />
            <Heading title="API" description="API Calls for Colors" />
            <Separator />
            <ApiList entityName="colors" entityIdName="colorId" />
        </>
    )
}