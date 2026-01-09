export const formatPeso = (val: string) => {
  if (!val) return "0";
  const [int, dec] = val.split(".");
  const formattedInt = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return dec !== undefined ? `${formattedInt}.${dec}` : formattedInt;
};

export class DateUtil {
  static formatDate(date: number) {
    return new Date(date).toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  static formatTime(date: number) {
    return new Date(date).toLocaleTimeString("en-PH", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  static changeTimeAndPreserveDate(baseDateNum: number, newDateNum: number) {
    const baseDate = new Date(baseDateNum);
    const newDate = new Date(newDateNum);

    baseDate.setHours(
      newDate.getHours(),
      newDate.getMinutes(),
      newDate.getSeconds(),
      newDate.getMilliseconds()
    );

    return baseDate;
  }

  static changeDateAndPreserveTime(baseDateNum: number, newDateNum: number) {
    const baseDate = new Date(baseDateNum);
    const newDate = new Date(newDateNum);

    baseDate.setFullYear(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate()
    );

    return baseDate;
  }
}
