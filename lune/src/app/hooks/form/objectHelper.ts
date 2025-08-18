export const recursivelyRemoveInvalidValues = (
    values: Record<any, any> = {}
  ) => {
    const finalValues: Record<any, any> = {};
  
    Object.keys(values).forEach((fieldName) => {
      let isValidValue = true;
      let fieldValue = values[fieldName];
  
      if (typeof fieldValue === 'string' || Array.isArray(fieldValue)) {
        isValidValue = fieldValue.length > 0;
      } else if (typeof fieldValue === 'undefined' || fieldValue === null) {
        isValidValue = false;
      } else if (typeof fieldValue === 'object') {
        fieldValue = recursivelyRemoveInvalidValues(fieldValue);
  
        isValidValue = Object.keys(fieldValue).length > 0;
      }
  
      if (isValidValue) {
        finalValues[fieldName] = fieldValue;
      }
    });
  
    Object?.keys(finalValues)?.forEach((key) => {
      const value = finalValues[key];
      if (typeof value === 'string') {
        finalValues[key] = value.trim();
      }
    });
  
    return finalValues;
  };
  
  export const normalizeSubmittedData = (
    defaultValue: Record<any, any> = {},
    submittedData: Record<any, any> = {}
  ) => {
    const normalizedData = { ...submittedData };
  
    Object.keys(defaultValue).forEach((key) => {
      if (key === 'id') return;
      if (
        !(key in submittedData) ||
        submittedData[key] === '' ||
        submittedData[key] === undefined
      ) {
        normalizedData[key] = null;
      }
    });
  
    return normalizedData;
  };
  