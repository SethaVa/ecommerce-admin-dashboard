import { Heading } from "@/components/ui/heading"
import { OrderColumn, columns } from "./columns"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data.table"

interface OrderClientProps{
    data: OrderColumn[]
}

const OrderClient: React.FC<OrderClientProps> = ({
    data
}) => {
    return (
        <>
            <Heading title={`Order (${data.length})`} description="Manage orders for your store" />
            <Separator />
            <DataTable data={data} columns={columns} searchKey="products" />
        </>
    )
}

export default OrderClient