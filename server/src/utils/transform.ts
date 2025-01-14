export const transformArrayInFormData = (value: string | string[]) => {
  if (typeof value === 'string') {
    return value.split(',').map((v) => Number(v));
  }

  if (Array.isArray(value)) {
    return value.map((v) => Number(v));
  }
};

export const normalizeDate = (dateString: string | Date): Date => {
  const date = dateString instanceof Date ? dateString : new Date(dateString);

  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
};
