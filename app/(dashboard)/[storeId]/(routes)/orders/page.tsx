import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";
import { format } from "date-fns";
import OrderClient from "./components/client";
import { Suspense } from "react";
import Loading from "./loading";

const OrderPage = async ({
    params
}: {
    params: {storeId: string}
}) => {
    const orders = await prismadb.order.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const formattedOrders = orders.map((order) => ({
        id: order.id,
        phone: order.phone,
        address: order.address,
        products: order.orderItems.map((orderItem) => orderItem.product.name).join(", "),
        totalPrice: formatter.format(order.orderItems.reduce((total, item) => {
            return total + Number(item.product.price)
          }, 0)),
          isPaid: order.isPaid,
          createdAt: format(order.createdAt, 'MMMM do, yyyy'),
    }))
    return (
        <Suspense fallback={<Loading />}>
            <div className="flex-col">
                <div className="flex-1 p-8 pt-6 space-y-4">
                    <OrderClient data={formattedOrders} />
                </div>
            </div>
        </Suspense>
    )
}

export default OrderPage;