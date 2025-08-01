"use client";

import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../apis/setting/settingService";
import { Card } from "../components/card";
import { Form } from "../components/custom-form/form";
import { useUpdateSetting } from "./hooks/use-update-setting";
import { toast } from "sonner";
import { ErrorState, LoadingSpinner, SettingsCard } from "./components";
import { settingsConfig } from "./config/settings-config";
import { Button } from "../components/button";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { HotkeyRedirect } from "../components/escape-hot-key";


export default function SettingsPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  });

  const { mutate, isPending } = useUpdateSetting();
  const router = useRouter();

  const handleSubmit = (formData: any) => {
    mutate({ updatedData: formData }, {
      onSuccess: () => {
        toast.success("تنظیمات با موفقیت بروزرسانی شد");
        refetch();
      },
      onError: (error) => {
        toast.error("خطا در بروزرسانی تنظیمات");
        console.error(error);
      }
    });
  };

  if (isLoading) return <LoadingSpinner />;

  if (isError) return <ErrorState message="خطا در دریافت تنظیمات" />;

  return (
    <div className="pb-8">
      <div className="max-w-5xl mx-auto mt-18">
        <Card className="bg-gray-100" >
          <div className="mb-4" >

            <Button onClick={() => router.push('/admin')} variant={"outline"} className="text-black"> <ArrowRight size={26} /></Button>
            <HotkeyRedirect redirectTo="/orders" />
          </div>
          <Form
            submitText={isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
            cancelText="انصراف"
            onSubmit={handleSubmit}
            defaultValues={data}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {settingsConfig.map((setting) => (
                <SettingsCard
                  key={setting.name}
                  title={setting.title}
                  name={setting.name}
                  icon={setting.icon}
                  value={data?.[setting.name]}
                  isPending={isPending}
                />
              ))}
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
}
