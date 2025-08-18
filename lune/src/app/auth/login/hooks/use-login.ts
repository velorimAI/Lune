import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { login } from "@/app/apis/auth/Service";

interface LoginFormData {
  code_meli: string;
  password: string;
}

export const useLogin = (
  options?: UseMutationOptions<any, Error, LoginFormData, unknown>
) => {
  return useMutation<any, Error, LoginFormData>(
    (formData: LoginFormData) => login(formData),
    options
  );
};
