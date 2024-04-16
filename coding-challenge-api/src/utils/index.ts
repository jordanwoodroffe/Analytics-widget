import moment from "moment";
import { OrderCSVdata } from "..";

export const calculateDaysOverdue = (order: OrderCSVdata) => {
  return moment().diff(moment(order.latest_ship_date, "DD/MM/YYYY"), "days");
};

export const binarySearch = (
  overdueOrders: OrderCSVdata[],
  daysOverdue: number
) => {
  let left = 0;
  let right = overdueOrders.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    const midDaysOverdue = calculateDaysOverdue(overdueOrders[mid]);

    if (midDaysOverdue === daysOverdue) {
      return mid;
    } else if (midDaysOverdue < daysOverdue) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return left;
};
