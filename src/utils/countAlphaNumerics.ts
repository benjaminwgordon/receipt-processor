export const countAlphaNumerics = (str: String) => {
  return str.replace(/[^A-Z0-9]/gi, '').length;
};
