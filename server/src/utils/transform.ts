export const transformArrayInFormData = (value: string | string[]) => {
  if (typeof value === 'string') {
    return value.split(',').map((v) => Number(v));
  }

  if (Array.isArray(value)) {
    return value.map((v) => Number(v));
  }
};
