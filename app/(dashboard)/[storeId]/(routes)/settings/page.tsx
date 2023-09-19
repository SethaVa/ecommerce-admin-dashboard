import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { SettingsForm } from "./components/settings-form";
import { Suspense } from "react";
import Loading from "./loading";


const SettingsPage = async ({params}: {params: {storeId: string}}) => {
    const {userId} = auth();

    if(!userId){
        redirect("/sign-in")
    }

    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId
        }
    })

    if(!store){
        redirect("/");
    }

    return (
        <Suspense fallback={<Loading />}>
            <div className="flex-col">
                <div className="space-y-4 flex-1 p-8 pb-6">
                    <SettingsForm initialData={store}/>
                </div>
            </div>
        </Suspense>
    )
}

export default SettingsPage;