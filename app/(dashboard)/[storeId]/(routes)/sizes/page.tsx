import prismadb from "@/lib/prismadb"
import { SizeColumn } from "./components/columns"
import { format } from "date-fns"
import { SizesClient } from "./components/client"
import { Suspense } from "react"
import Loading from "./loading"

const SizesPage = async ({
    params
}: {
    params: {storeId: string}
}) => {
    const sizes = await prismadb.size.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
          }
    })

    const formattedSizes: SizeColumn[] = sizes.map((item: any) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return (
        <Suspense fallback={<Loading />}>
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <SizesClient data={formattedSizes} />
                </div>
            </div>
        </Suspense>
    )
}

export default SizesPage;