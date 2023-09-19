"use client"

import { ColumnDef } from "@tanstack/react-table"
import React from "react"
import { CellAction } from "./cell-action"
import { Badge } from "@/components/ui/badge"

export type ProductColumn = {
    id: string,
    name: string,
    price: string,
    category: string,
    color: string,
    size: string,
    createdAt: string,
    isArchived: boolean,
    isFeatured: boolean
}

export const columns: ColumnDef<ProductColumn>[] = [
    {
        accessorKey: "name",
        header: "Name"
    },
    {
        accessorKey: "isArchived",
        header: "Archived",
        cell: ({row}) => (
            <div className="flex items-center gap-x">
                {
                    row.original.isArchived?
                    <Badge variant="destructive" className="bg-green-600 hover:bg-green-500">true</Badge>:
                    <Badge variant="destructive">false</Badge>
                }
            </div>
        )
    },
    {
        accessorKey: "isFeatured",
        header: "Featured",
        cell: ({row}) => (
            <div className="flex items-center gap-x">
                {
                    row.original.isFeatured?
                    <Badge variant="destructive" className="bg-green-600 hover:bg-green-500">true</Badge>:
                    <Badge variant="destructive">false</Badge>
                }
            </div>
        )
    },
    {
        accessorKey: "price",
        header: "Price"
    },
    {
        accessorKey: "category",
        header: "Category"
    },
    {
        accessorKey: "size",
        header: "Size"
    },
    {
        accessorKey: "color",
        header: "Color",
        cell: ({ row }) => (
            <div className="flex items-center gap-x-2">
                {row.original.color}
                <div className="h-6 w-6 rounded-full border" style={{backgroundColor: row.original.color}} />
            </div>
        )
    },
    {
        accessorKey: "createdAt",
        header: "Date"
    },
    {
        id: "actions",
        cell: ({row}) => <CellAction data={row.original} />
    }
] 