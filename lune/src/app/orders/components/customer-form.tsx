import { Input } from "@/app/components/custom-form/input";
import { Select } from "@/app/components/custom-form/select-box";
import { Form } from "@/app/components/custom-form/form";
import { Card } from "@/app/components/card";
import { useCustomerInputRefs } from "../hooks";
import { JalaliDatePicker } from "@/app/components/date-picker-ui";
import { carOptions } from "@/constants/carOptions";

interface CustomerFormProps {
  userForm: any;
  userInfoSubmitted: boolean;
  onSubmit: (data: any) => void;

}

export function CustomerForm({
  userForm,
  userInfoSubmitted,
  onSubmit,
}: CustomerFormProps) {
  const { refs } = useCustomerInputRefs();

  const { control } = userForm;

  return (
    <Card title="اطلاعات مشتری" className="p-0 pb-4">
      <Form
        submitText="ثبت اطلاعات"
        cancelHide
        onSubmit={onSubmit}
        submitDisable={userInfoSubmitted}

      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Input
            label="نام مشتری"
            name="customer_name"
            required
            disabled={userInfoSubmitted}
            ref={refs.customerNameRef}

          />
          <Input
            label="شماره تماس"
            name="phone_number"
            phone
            required
            disabled={userInfoSubmitted}
            ref={refs.phoneNumberRef}
          />
          <Input
            label="شماره پذیرش"
            name="reception_number"
            required
            disabled={userInfoSubmitted}
            ref={refs.receptionNumberRef}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <Input label="شماره شاسی" name="chassis_number" required disabled={userInfoSubmitted} />
          <Select
            label="نام خودرو"
            name="car_name"
            value="MVM X5"
            inputStyle="w-full"
            options={carOptions}
            required
            disabled={userInfoSubmitted}
          />
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
            hiddenSearch
          />
          <JalaliDatePicker
            control={control}
            name="reception_date"
            label=" تاریخ پذیرش"
            required
            className="text-right"
            disabled={userInfoSubmitted}
          />
        </div>
      </Form>
    </Card>
  );
}
