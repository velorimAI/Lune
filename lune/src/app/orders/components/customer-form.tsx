import { Input } from "@/app/components/custom-form/input";
import { Select } from "@/app/components/custom-form/select-box";
import { Form } from "@/app/components/custom-form/form";
import { Card } from "@/app/components/card";
import { getTodayJalaliDate } from "@/app/utils/getTodayJalali";
import { UseFormReturn } from "react-hook-form";
import { useCustomerInputRefs } from "../hooks";

interface CustomerFormProps {
  userForm: UseFormReturn<any>;
  userInfoSubmitted: boolean;
  onSubmit: (data: any) => void;
  
}

export function CustomerForm({
  userForm,
  userInfoSubmitted,
  onSubmit,
}: CustomerFormProps) {
  const { refs } = useCustomerInputRefs();

  return (
    <Card title="اطلاعات مشتری" className="p-0 pb-4">
      <Form
        submitText="ثبت اطلاعات"
        cancelHide
        onSubmit={onSubmit}
        submitDisable={userInfoSubmitted}
        // methods={userForm}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Input
            label="نام مشتری"
            name="customer_name"
            required
            readOnly={userInfoSubmitted}
            ref={refs.customerNameRef}
            justPersian
          />
          <Input
            label="شماره تماس"
            name="phone_number"
            phone
            required
            readOnly={userInfoSubmitted}
            ref={refs.phoneNumberRef}
          />
          <Input
            label="شماره پذیرش"
            name="reception_number"
            required
            readOnly={userInfoSubmitted}
            ref={refs.receptionNumberRef}
          />
          <Select
            label="نام خودرو"
            name="car_name"
            value=""
            inputStyle="w-full"
            placeholder="نام خودرو را انتخاب کنید"
            options={[
              { value: "MVM X22 Pro MT", label: "MVM X22 Pro MT" },
              { value: "MVM X22 Pro AT", label: "MVM X22 Pro AT" },
              { value: "MVM X33 Cross MT", label: "MVM X33 Cross MT" },
              { value: "MVM X33 Cross CVT", label: "MVM X33 Cross CVT" },
              { value: "MVM Arrizo5 FL", label: "MVM Arrizo5 FL" },
              { value: "MVM X55 Pro IE", label: "MVM X55 Pro IE" },
              { value: "MVM X77", label: "MVM X77" },
              { value: "MVM X5", label: "MVM X5" },
              { value: "MVM 110", label: "MVM 110" },
              { value: "MVM 110S", label: "MVM 110S" },
              { value: "MVM 315", label: "MVM 315" },
              { value: "MVM 315 plus", label: "MVM 315 plus" },
              { value: "MVM 530", label: "MVM 530" },
              { value: "MVM 550", label: "MVM 550" },
              { value: "MVM X22", label: "MVM X22" },
              { value: "MVM X33s", label: "MVM X33s" },
              { value: "MVM X55", label: "MVM X55" },
              { value: "Fownix Arrizo 8", label: "Fownix Arrizo 8" },
              { value: "Fownix Arrizo 6 Pro", label: "Fownix Arrizo 6 Pro" },
              { value: "Fownix Arrizo 6 GT", label: "Fownix Arrizo 6 GT" },
              { value: "MVM Tiggo 7", label: "MVM Tiggo 7" },
              { value: "MVM Tiggo 7 IE", label: "MVM Tiggo 7 IE" },
              {
                value: "Fownix Tiggo 7 Pro Premium",
                label: "Fownix Tiggo 7 Pro Premium",
              },
              {
                value: "Fownix Tiggo 7 Pro Max",
                label: "Fownix Tiggo 7 Pro Max",
              },
              {
                value: "Fownix Tiggo 7 Pro Max AWD",
                label: "Fownix Tiggo 7 Pro Max AWD",
              },
              { value: "Arrizo 8 e+", label: "Arrizo 8 e+" },
              {
                value: "Fownix Tiggo 8 Pro Max IE",
                label: "Fownix Tiggo 8 Pro Max IE",
              },
              { value: "Fownix FX", label: "Fownix FX" },
              { value: "Fownix FX AWD", label: "Fownix FX AWD" },
              {
                value: "Fownix Tiggo 7 Pro e+",
                label: "Fownix Tiggo 7 Pro e+",
              },
              {
                value: "Fownix Tiggo 8 Pro e+",
                label: "Fownix Tiggo 8 Pro e+",
              },
              { value: "Fownix FX EV", label: "Fownix FX EV" },
              { value: "XTRIM VX", label: "XTRIM VX" },
              { value: "XTRIM TXL", label: "XTRIM TXL" },
              { value: "XTRIM LX", label: "XTRIM LX" },
              { value: "XTRIM RX", label: "XTRIM RX" },
            ]}
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

          <Input
            label="تاریخ پذیرش"
            value={getTodayJalaliDate()}
            name="reception_date"
            required
            readOnly
          />
        </div>
      </Form>
    </Card>
  );
}
