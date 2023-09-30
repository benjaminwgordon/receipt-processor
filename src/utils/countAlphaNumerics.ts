export const countAlphaNumerics = (str: string) => {
  return str.replace(/[^A-Z0-9]/gi, '').length;
};
