"use client";
import { Card } from "@/app/components/card";
import { Form } from "@/app/components/custom-form/form";
import { Input } from "@/app/components/custom-form/input";

import { FC } from "react";

const Login: FC = () => {
  const onSubmit = (data : any) => {
    console.log(data.username);
  };
  return (
    <div className="min-h-screen  bg-cover bg-center">
      <div className="flex items-center justify-center min-h-screen">
        <Card
          title="ورود به سیستم"
          className="bg-green-100"
          titleStyle="flex justify-center items-center"
        >
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
