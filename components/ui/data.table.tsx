"use client";

import { ColumnDef, ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel } from "@tanstack/table-core";
import { Input } from "./input";
import { useState } from "react";
import { flexRender, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Inbox } from "lucide-react";

interface DataTableProps<TData, TValue>{
    columns: ColumnDef<TData, TValue>[],
    data: TData[],
    searchKey: string
}

export function DataTable<TData, TValue> ({
    columns,
    data,
    searchKey
}: DataTableProps<TData, TValue>){
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters
        }
    })

    return (
        <div>
            <div className="flex items-center py-4">
                <Input 
                    placeholder="Search"
                    value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                    onChange={(event) => 
                        table.getColumn(searchKey)?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md">
                <Table>
                    <TableHeader>
                        {
                            table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {
                                        headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id}>
                                                    {
                                                        header.isPlaceholder?
                                                        null :
                                                        flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )
                                                    }
                                                </TableHead>
                                            )
                                        })
                                    }
                                </TableRow>
                            ))
                        }
                    </TableHeader>
                    <TableBody>
                        {
                            table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {
                                            row.getVisibleCells().map((cell) => {
                                                return (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                )
                                            })
                                        }
                                    </TableRow>
                                )) 
                            ):(
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="text-center w-full">
                                        <div className="flex flex-col items-center justify-center">
                                            <Inbox className="mr-2 w-28 h-28 text-gray-400" />
                                            <p className="tracking-tight text-lg text-gray-400">No data</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) 
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}