import React from "react";
import { Modal } from "@/app/components/modal";
import { Form } from "@/app/components/custom-form/form";
import { Input } from "@/app/components/custom-form/input";

interface InsertFinalOrderNumberProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (description: string) => void;
    data?: any
}

export const InsertFinalOrderNumber = ({
    open,
    onClose,
    onSubmit,
    data
}: InsertFinalOrderNumberProps) => {

    const handleConfirm = (data: any) => {
        onSubmit(data.final_order_number);
        onClose();
    };


    

    return (
        <Modal
            open={open}
            title="شماره حواله را وارد کنید"
            onCancel={onClose}
            hideCancel
            hideConfirm
        >
            <Form cancelText="لغو" submitText="ثبت شماره حواله" onSubmit={handleConfirm}>
                <Input label="شماره حواله" name="final_order_number" value={data?.order_number || ""}  />
            </Form>
        </Modal>
    );
};