import prismadb from "@/lib/prismadb"
import { SizeColumn } from "./components/columns"
import { format } from "date-fns"
import { ColorsClient } from "./components/client"
import { Suspense } from "react"
import Loading from "./loading"

const ColorsPage = async ({
    params
}: {
    params: {storeId: string}
}) => {
    const colors = await prismadb.color.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
          }
    })

    const formattedColors: SizeColumn[] = colors.map((item: any) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return (
        <Suspense fallback={<Loading />}>
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <ColorsClient data={formattedColors} />
                </div>
            </div>
        </Suspense>
    )
}

export default ColorsPage;