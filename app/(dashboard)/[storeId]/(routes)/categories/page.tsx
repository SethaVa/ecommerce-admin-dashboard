import prismadb from "@/lib/prismadb";
import { CategoryColumn } from "./components/columns";
import { format } from "date-fns";
import { CategoriesClient } from "./components/client";
import { Suspense } from "react";
import Loading from "./loading";

const CategoryPage = async ({
    params
}: {params: {storeId: string}}) => {
    const categories = await prismadb.category.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            billboard: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const formattedCategories: CategoryColumn[] = categories.map((item: any) => ({
        id: item.id,
        name: item.name,
        billboardLabel: item.billboard.label,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))
    
    return (
        <Suspense fallback={<Loading />}>
            <div className="flex-col">
                <div className="flex-1 p-8 pt-6 space-y-4">
                    <CategoriesClient data={formattedCategories} />
                </div>
            </div>
        </Suspense>
    )
}

export default CategoryPage;