import { Request, Response } from "express";
import moment from "moment";
import { OrderCSVdata } from ".";

export const getSalesHandler = (
  overdueOrders: OrderCSVdata[],
  stores: Map<string, any>
) => {
  return async function getSales(req: Request, res: Response) {
    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    const sort = (req.query.sort as string) || "asc";
    const skip = (page - 1) * limit;
    const end = skip + limit;

    let result;
    if (sort === "dsc") {
      /* 
      This is already ordered in asc, so we effectively have the list ordered for dsc 
      if we traverse from the back of the array
      */
      result = overdueOrders.slice(-end, overdueOrders.length - skip).reverse();
    } else {
      result = overdueOrders.slice(skip, end);
    }

    result = result
      .map((order) => {
        const store = stores.get(order.storeId);
        if (store) {
          return {
            marketplace: store.marketplace,
            shopName: store.shopName,
            orderId: order.orderId,
            orderValue: order.orderValue,
            items: order.items,
            destination: order.destination,
            daysOverdue: moment().diff(
              moment(order.latest_ship_date, "DD/MM/YYYY"),
              "days"
            ),
          };
        }
        return null;
      })
      .filter((order) => order !== null);

    res.json(result);
  };
};
