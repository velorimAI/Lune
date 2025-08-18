"use client";

import { ReactNode, useEffect, FC } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "../button";
import { recursivelyRemoveInvalidValues } from "@/app/hooks/form/objectHelper";

type OnFormStateTypes = {
  isDirty?: boolean;
  isValid?: boolean;
  errors?: any;
  isSubmitSuccessful?: boolean;
  isSubmitting?: boolean;
  isSubmitted?: boolean;
  isValidating?: boolean;
  dirtyFields?: any;
};

type FormProps = {
  onSubmit?: (values?: Record<any, any> | Record<any, any>[]) => void;
  children?: ReactNode;
  className?: string;
  defaultValues?: Record<any, any>;
  isLoading?: boolean;
  submitLoading?: boolean;
  submitHide?: boolean;
  submitText?: string;
  submitDisable?: boolean;
  cancelText?: string;
  cancelHide?: boolean;
  sanitizeValues?: boolean;
  onCancel?: () => void;
  cancelHref?: string;
  onFormState?: (data?: OnFormStateTypes) => void;
  defaultValue?: Record<any, any>;
  methods?: any;
};

export const Form: FC<FormProps> = (props) => {
  const {
    onSubmit,
    children,
    className,
    defaultValues,
    isLoading,
    submitLoading,
    submitDisable = false,
    submitText = "Create",
    submitHide,
    cancelText = "Cancel",
    cancelHide,
    sanitizeValues = true,
    onCancel,
    cancelHref,
    onFormState,
    methods: injectedMethods,
  } = props;

  const router = useRouter();

  const internalMethods = useForm<any>({ defaultValues });
  const methods = injectedMethods || internalMethods;

  useEffect(() => {
    if (onFormState) {
      onFormState({ ...methods.formState });
    }
  }, [methods.formState , onFormState]);

  const onFormSubmit = (values: Record<any, any> = {}) => {
    const result = sanitizeValues
      ? recursivelyRemoveInvalidValues(values)
      : values;
    onSubmit?.(result);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      if (cancelHref) {
        router.push(cancelHref);
      } else {
        router.back();
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <div className="w-full pt-10">
          <Skeleton className="h-10" />
        </div>
        <div className="flex justify-end gap-4 pt-7">
          <Skeleton className="h-10 w-72" />
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onFormSubmit)} className={className}>
        {children}
        <div className="w-full">
          <div className="flex justify-end gap-4">
            {!cancelHide && (
              <Button
                type="button"
                variant="outline"
                className="text-black"
                onClick={handleCancel}
              >
                {cancelText}
              </Button>
            )}
            {!submitHide && (
              <Button
                type="submit"
                isLoading={submitLoading}
                disabled={submitDisable || submitLoading}
              >
                {submitText}
              </Button>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
