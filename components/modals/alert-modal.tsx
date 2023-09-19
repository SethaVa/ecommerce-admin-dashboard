import React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "../ui/button";

interface AlertModalProps{
    isOpen: boolean,
    isLoading: boolean,
    onClose: () => void,
    onConfirm: () => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({
    isOpen,
    isLoading,
    onClose,
    onConfirm
}) => {
    return (
        <Modal
            title="Are you sure?"
            description="The action cannot be undone."
            onClose={onClose}
            isOpen={isOpen}
        >
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button disabled={isLoading} variant={"outline"} onClick={onClose}>Cancel</Button>
                <Button disabled={isLoading} onClick={onConfirm}>Continue</Button>
            </div>
        </Modal>
    )
}