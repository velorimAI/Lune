type formValidationParams = {
  validations: {
    required?: boolean;
    email?: boolean;
    strongPassword?: boolean;
    ip?: boolean;
    phone?: boolean;
    hasHoursAndMinutes?: boolean;
    isPositiveNumber?: boolean;
    idNumber?: boolean;
  };
  label?: string;
  valueState?: any;
};

export const useFormFieldValidations = (params: formValidationParams) => {
  const { validations, label } = params;

  const {
    required,
    email,
    strongPassword,
    ip,
    phone,
    hasHoursAndMinutes,
    isPositiveNumber,
    idNumber,
  } = validations;

  const validationObject: Record<any, any> = {
    validate: {},
  };

  if (email) {
    validationObject.validate.email = (value?: string) =>
      value &&
        !/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(
          value
        )
        ? `${label} is not valid.`
        : undefined;
  }

  if (strongPassword) {
    validationObject.validate.strongPassword = (value: string) => {
      if (value) {
        if (value.length < 8) {
          return `${label} must be more than 8 characters.`;
        } else if (value !== value.trim()) {
          return `${label} must not start or end with a space.`;
        } else if (!/[a-z]/.test(value)) {
          return `${label} must contain at least one lowercase letter.`;
        } else if (!/[A-Z]/.test(value)) {
          return `${label} must contain at least one uppercase letter.`;
        } else if (!/\d/.test(value)) {
          return `${label} must contain at least one number.`;
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
          return `${label} must contain at least one special character.`;
        }
      }
      return undefined;
    };
  }

  if (ip) {
    validationObject.validate.ip = (value?: string) =>
      value &&
        !/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
          value
        )
        ? `${label} is not a valid IP address.`
        : undefined;
  }

  if (phone) {
    validationObject.validate.phone = (value?: string) =>
      value && !/^0\d{10}$/.test(value)
        ? `${label} باید ۱۱ رقم و با ۰ شروع شود.`
        : undefined;
  }

  if (required) {
    validationObject.validate.required = (value?: string) =>
      !value ? `${label} را وارد کنید.` : undefined;
  }

  if (email) {
    validationObject.validate.email = (value?: string) =>
      value && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
        ? `ایمیل نامعتبر است.`
        : undefined;
  }

  if (strongPassword) {
    validationObject.validate.strongPassword = (value?: string) =>
      value && !/(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(value)
        ? `رمزعبور قوی وارد کنید.`
        : undefined;
  }

  return validationObject;
};
