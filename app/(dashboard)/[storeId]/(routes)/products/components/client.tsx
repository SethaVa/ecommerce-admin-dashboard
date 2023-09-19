"use client"

import React from "react"
import { ProductColumn, columns } from "./columns"
import { useParams, useRouter } from "next/navigation"
import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { ApiList } from "@/components/ui/api-list"
import { DataTable } from "@/components/ui/data.table"

interface ProductsClientProps{
    data: ProductColumn[]
}

export const ProductsClient: React.FC<ProductsClientProps> = ({
    data
}) => {
    const params = useParams();
    const router = useRouter();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Products (${data.length})`} description="Manage products for your store" />
                <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
                    <Plus className="w-4 h-4 mr-2" /> Add New
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="name" columns={columns} data={data} />
            <Heading title="API" description="API Calls for Products" />
            <Separator />
            <ApiList entityName="products" entityIdName="productId" />
        </>
    )
}