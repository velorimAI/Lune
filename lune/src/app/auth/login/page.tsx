"use client";
import { Card } from "@/app/components/card";
import { Form } from "@/app/components/custom-form/form";
import { Input } from "@/app/components/custom-form/input";
import Image from "next/image";
import { FC } from "react";

const Login: FC = () => {
  const onSubmit = (data: any) => {
    console.log(data.username);
  };
  return (
    <div className="min-h-screen  bg-cover bg-center">
    {/* <div className="min-h-screen  bg-cover bg-center bg-[url('/img/background/back.jpg')]"> */}
      <div className="flex flex-col items-center justify-center min-h-screen shadow-gray-700 shadow-2xl">
        <Card
          // title="ورود به سیستم"
          className="bg-green-100"
          titleStyle="flex justify-center items-center"
        >
          <Image
            src="\img\environment-icon.svg"
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
              inputClassName="bg-white"
              name="username"
            />
            <Input
              label="رمز عبور"
              placeholder="رمز عبور را وارد کنید :"
              className="w-[400px]"
              inputClassName="bg-white"
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
