"use client"

import React from "react"
import { BillboardColumn, columns } from "./columns"
import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import { useParams, useRouter } from "next/navigation"
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator"
import { ApiList } from "@/components/ui/api-list"
import { DataTable } from "@/components/ui/data.table"

interface BillboardClientProps {
    data: BillboardColumn[]
}
export const BillboardClient: React.FC<BillboardClientProps> = ({data}) => {
    const router = useRouter();
    const params = useParams();
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title={`Billboards ${data.length}`} 
                    description="Manage billboards for your store"
                />
                <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
                    <Plus className="mr-2 w-4 h-4" /> Add New
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="label" data={data} columns={columns}/>
            <Heading title="API" description="API Calls for Billboards" />
            <Separator />
            <ApiList entityName="billboards" entityIdName="billboardId"/>
        </>
    )
}