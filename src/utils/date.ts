import { format, differenceInMinutes } from "date-fns";

export function formatCreatedAt(d: Date) {
  const minutes = differenceInMinutes(new Date(), d);
  if (minutes < 60) {
    return `${minutes}m`;
  } else if (minutes < 24 * 60) {
    return `${Math.floor(minutes / 60)}h`;
  }

  return format(d, "MMM dd");
  //return format(d, "yyyy-MM-dd hh:mm:ss");
}
