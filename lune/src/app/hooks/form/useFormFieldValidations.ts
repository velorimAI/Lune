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
      value && !/^(\+\d{1,3})\d{10}$/.test(value)
        ? `${label} is not a valid phone number.`
        : undefined;
  }

  if (hasHoursAndMinutes) {
    validationObject.validate.hasHoursAndMinutes = (value?: string) =>
      value && !/^(?:[01]?\d|2[0-3]):[0-5]\d$/.test(value)
        ? `Value is not a valid time.`
        : undefined;
  }

  if (isPositiveNumber) {
    validationObject.validate.isPositiveNumber = (value?: string) =>
      value && Number(value) < 0
        ? `${label} must be a positive number.`
        : undefined;
  }

  if (idNumber) {
    validationObject.validate.idNumber = (value?: string) =>
      value && !/^\d{9}$/.test(value)
        ? `${label || 'شماره'} باید دقیقاً ۹ رقم باشد.`
        : undefined;
  }


  if (required) {
    validationObject.required = `${label} is required.`;
  }

  return validationObject;
};
