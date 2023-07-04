"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";

export const StoreModal = () => {
    const storeModal = useStoreModal();

    return (
        <Modal
            title="Create store"
            description="Add a new store to manage products and categories"
            onClose={storeModal.onClose}
            isOpen={storeModal.isOpen}
        >
            Future form here
        </Modal>
    )
}