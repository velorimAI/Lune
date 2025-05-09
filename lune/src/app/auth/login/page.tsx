"use client";
import { Card } from "@/app/components/card";
import { Form } from "@/app/components/custom-form/form";
import { Input } from "@/app/components/custom-form/input";
import Image from "next/image";
import { FC } from "react";
import axios from "axios";

const Login: FC = () => {
  // const onSubmit = (data: any) => {
  //   console.log(data.username);
  // };

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.post("http://localhost:5000/login", {
        code_meli: data.username,
        password: data.password,
      });

      console.log("Login successful:", response.data);
      alert(`Welcome ${response.data.name} ${response.data.last_name}!`);
    } catch (error: any) {
      console.error("Login failed:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen  bg-cover bg-center">
      {/* <div className="min-h-screen  bg-cover bg-center bg-[url('/img/background/back.jpg')]"> */}
      <div className="flex flex-col items-center justify-center min-h-screen shadow-gray-700 shadow-2xl">
        <Card
          // title="ورود به سیستم"
          titleStyle="flex justify-center items-center"
          variant="ghost"
        >
          <Image
            src="/img/logo/fix-logo.jpg"
            alt="Logo"
            width={100}
            height={100}
            className="mx-auto object-contain mt-4 mb-4"
          />
          <Form onSubmit={onSubmit} submitText="ورود" cancelHide>
            <Input
              label="نام کاربری"
              placeholder="نام کابری خود را وارد کنید :"
              className="w-[400px] "
              name="username"
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
