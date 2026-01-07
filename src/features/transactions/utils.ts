export const formatPeso = (val: string) => {
  if (!val) return "0";
  const [int, dec] = val.split(".");
  const formattedInt = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return dec !== undefined ? `${formattedInt}.${dec}` : formattedInt;
};
