"use client";

import { FormField } from "@/app/components/form-field";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FC, ReactNode } from "react";

import { InputTypes } from "@/types/common";
import CustomSelector from "./custom-selector";

interface Props {
  mode?: string;
  data?: Record<string, any>;
  onSubmit?: (value?: any) => void;
  handleSubmit?: any;
  register?: any;
  footer?: ReactNode;
  backHref?: string;
  fields?: {
    type?: InputTypes;
    placeholder?: string;
    label?: string;
    reqiured?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    dataFieldName?: string;
    options?: { value: string; label: string }[];
    error?: string | undefined;
  }[];
}
const Form: FC<Props> = ({
  data = {},
  mode,
  footer,
  fields,
  onSubmit,
  register,
}) => {
  const router = useRouter();

  return (
    <form onSubmit={onSubmit} className="flex flex-wrap gap-5 w-full p-1">
      {fields?.map((field, index) => {
        if (
          field?.type === InputTypes.string ||
          field?.type === InputTypes.password ||
          field?.type === InputTypes.email
        ) {
          return (
            <FormField
              className="flex-col gap-1 items-start"
              key={index}
              type={field?.type}
              disabled={field?.disabled}
              readOnly={field?.readOnly}
              reqiured={field?.reqiured ?? false}
              label={field?.label || ""}
              register={register(`${field?.dataFieldName}`, {
                required: field?.reqiured
                  ? `${field?.label} is required`
                  : false,
              })}
              width="w-96"
              defaultValue={
                mode === "create" ? "" : data?.[field.dataFieldName!] || ""
              }
              placeholder={field?.placeholder ?? ""}
              error={field?.error}
            />
          );
        } else if (field.type === InputTypes.selector) {
          return (
            <CustomSelector
              currentValue={
                mode === "create" ? "" : data?.[field.dataFieldName!]
              }
              key={index}
              label={field?.label || ""}
              options={field?.options}
              width="w-96"
            />
          );
        }
        return null;
      })}

      <div className="w-full">
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit">
            {mode === "create" ? "Create" : mode === "edit" ? "Save" : "View"}
          </Button>
        </div>
        {footer}
      </div>
    </form>
  );
};

export default Form;
