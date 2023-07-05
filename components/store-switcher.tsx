"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./ui/command";
import { PlusCircle, Check, Store, ChevronsUpDown } from 'lucide-react';
import { useState } from "react";
import { useStoreModal } from "@/hooks/use-store-modal";
import { Separator } from "./ui/separator";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProp extends PopoverTriggerProps{
    items: Record<string, any>[]
}

const StoreSwitcher = ({className, items = []}: StoreSwitcherProp) => {
    const router = useRouter();
    const params = useParams();

    const [open, setOpen] = useState(false);
    const storeModal = useStoreModal();

    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id
      }));
    
    const currentStore = formattedItems.find((item) => item.value === params.storeId);

    const onStoreSelect = (store: {label: string, value: string}) => {
        setOpen(false);
        router.push(`/${store.value}`)
    }
    return <div>
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button 
                    variant="outline" 
                    size="sm"
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Select a store"
                    className={cn("w-[200px] justify-between", className)}
                >
                    <Store className="mr-2 h-4 w-4" />
                    {currentStore?.label}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <Command>
                    <CommandInput placeholder="Search store..." />
                    <CommandList>
                        <CommandEmpty>No store found.</CommandEmpty>
                        <CommandGroup heading="Stores">
                    
                            {
                                formattedItems.map((store) => (
                                    <CommandItem
                                        key={store.value}
                                        className="text-sm"
                                        onSelect={() => onStoreSelect(store)}
                                    >
                                        <Store className="mr-2 w-4 h-4" />
                                        <span>{store.label}</span>
                                        <Check 
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                currentStore?.value === store.value
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                        />
                                    </CommandItem>
                                ))
                            }
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator/>
                    <CommandList>
                        <CommandGroup>
                            <CommandItem
                                onSelect={
                                    () => {
                                        setOpen(false)
                                        storeModal.onOpen()
                                    }
                                }
                            >
                                <PlusCircle className="w-5 h-5 mr-2"/>
                                <span>Create Store</span>
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
            </Popover>
    </div>
}

export default StoreSwitcher;