import prismadb from "@/lib/prismadb";
import { BillboardColumn } from "./components/columns";
import { format } from "date-fns";
import { BillboardClient } from "./components/client";
import { Suspense } from "react";
import Loading from "./loading";

const BillBoardsPage = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
      
    },
  });

  const formattedBillboards: BillboardColumn[] = billboards.map(
    (item: any) => ({
      id: item.id,
      label: item.label,
      createdAt: format(item.createdAt, "MMMM dd, yyyy"),
    })
  );
  return (
    <Suspense fallback={<Loading />}>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6 ">
          <BillboardClient data={formattedBillboards} />
        </div>
      </div>
    </Suspense>
  );
};

export default BillBoardsPage;
