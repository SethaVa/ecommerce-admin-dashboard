import prismadb from "@/lib/prismadb"
import { format } from "date-fns"
import { ProductColumn } from "./components/columns"
import { ProductsClient } from "./components/client"
import { formatter } from "@/lib/utils"
import { Suspense } from "react"
import Loading from "./loading"

const ProductsPage = async ({
    params
}: {
    params: {storeId: string}
}) => {
    const products = await prismadb.product.findMany({
        where: {
          storeId: params.storeId
        },
        include: {
          category: true,
          size: true,
          color: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

    const formattedProducts: ProductColumn[] = products.map((item: any) => ({
        id: item.id,
        name: item.name,
        isFeatured: item.isFeatured,
        isArchived: item.isArchived,
        category: item.category.name,
        color: item.color.name,
        size: item.color.name,
        price: formatter.format(item.price.toNumber()),
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return (
      <Suspense fallback={<Loading />}>
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductsClient data={formattedProducts} />
            </div>
        </div>
      </Suspense>
    )
}

export default ProductsPage;