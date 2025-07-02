import { Input } from "@/app/components/custom-form/input";
import { Select } from "@/app/components/custom-form/select-box";
import { Form } from "@/app/components/custom-form/form";
import { Card } from "@/app/components/card";
import { getTodayJalaliDate } from "@/app/utils/getTodayJalali";
import { useCustomerInputRefs } from "../hooks/useCustomerInputRefs";
import { UseFormReturn } from "react-hook-form";

interface CustomerFormProps {
  userForm: UseFormReturn<any>; // می‌تونی به جای `any` نوع دقیق‌تر فرم رو بزاری
  userInfoSubmitted: boolean;
  onSubmit: (data: any) => void; // می‌تونی نوع دقیق‌تر data رو بزاری
}


export default function CustomerForm({ userForm, userInfoSubmitted, onSubmit }: CustomerFormProps) {
  const { refs } = useCustomerInputRefs();

  return (
    <Card title="اطلاعات مشتری" className="p-0 pb-4">
      <Form
        submitText="ثبت اطلاعات"
        cancelHide
        onSubmit={onSubmit}
        submitDisable={userInfoSubmitted}
        methods={userForm}
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          <Input label="نام مشتری" name="customer_name" required readOnly={userInfoSubmitted} ref={refs.customerNameRef} />
          <Input label="شماره تماس" name="phone_number" phone required readOnly={userInfoSubmitted} ref={refs.phoneNumberRef} />
          <Select
            label="وضعیت خودرو"
            name="car_status"
            value="متوقف"
            inputStyle="w-full"
            options={[
              { value: "متوقف", label: "متوقف" },
              { value: "متوقع", label: "متوقع" },
            ]}
            required
            disabled={userInfoSubmitted}
          />
          <Input label="شماره پذیرش" name="reception_number" required readOnly={userInfoSubmitted} ref={refs.receptionNumberRef} />
          <Input label="تاریخ پذیرش" value={getTodayJalaliDate()} name="reception_date" required readOnly />
        </div>
      </Form>
    </Card>
  );
}
