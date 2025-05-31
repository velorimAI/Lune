"use client";
import { Card } from "@/app/components/card";
import { Form } from "@/app/components/custom-form/form";
import { Input } from "@/app/components/custom-form/input";
import Image from "next/image";
import { FC, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Login: FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/login",
        {
          code_meli: Number(data.username),
          password: data.password,
        }
      );
      const { name, last_name } = response.data;

      toast.success(`خوش آمدید، ${name} ${last_name}`, {
        action: {
          label: "بستن",
          onClick: () => console.log("Undo"),
        },
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("name", name);
      localStorage.setItem("lastname", last_name);
      router.push("/orders");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || error.message || "ورود ناموفق بود"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center">
      <div className="flex flex-col items-center justify-center min-h-screen shadow-gray-700 shadow-2xl">
        <Card titleStyle="flex justify-center items-center" variant="ghost">
          <Image
            src="/img/logo/fix-logo.jpg"
            alt="Logo"
            width={100}
            height={100}
            className="mx-auto object-contain mt-4 mb-4"
          />
          <Form
            onSubmit={onSubmit}
            submitText="ورود"
            cancelHide
            submitLoading={loading}
          >
            <Input
              label="نام کاربری"
              placeholder="نام کابری خود را وارد کنید :"
              className="w-[400px]"
              name="username"
              idNumber
              type="number"              
            />
            <Input
              label="رمز عبور"
              placeholder="رمز عبور را وارد کنید :"
              className="w-[400px]"
              type="password"
              name="password"
            />
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
