import prismadb from "@/lib/prismadb"

interface GraphData{
    name: string,
    total: Number
}

export const getGraphRevenue = async (storeId: string): Promise<GraphData[]> => {
    const paidOrders = await prismadb.order.findMany({
        where: {
            storeId,
            isPaid: true
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        }
    });

    const monthlyRevenue: { [key: number]: number} = {};

    // grouping paid order by month and summing the revenue
    for(let order of paidOrders){
        const month = order.createdAt.getMonth(); // 0 for Jan, 1 For Feb...
        let revenueForOrder = 0;

        for(const item of order.orderItems){
            revenueForOrder += item.product.price.toNumber();
        }

        // Adding the revenue for this order to the respective month
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder
    }

    // Converting the grouped data into the format expected by the graph
    const graphData: GraphData[] = [
        { name: "Jan", total: 0 },
        { name: "Feb", total: 0 },
        { name: "Mar", total: 0 },
        { name: "Apr", total: 0 },
        { name: "May", total: 0 },
        { name: "Jun", total: 0 },
        { name: "Jul", total: 0 },
        { name: "Aug", total: 0 },
        { name: "Sep", total: 0 },
        { name: "Oct", total: 0 },
        { name: "Nov", total: 0 },
        { name: "Dec", total: 0 },
    ];

    // Filling the revenue data
    for(let month in monthlyRevenue){
        graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)]
    }   

    return graphData;
}