import express from "express";
import cors from "cors";
import { getUser } from "./user";
import fs from "fs";
import csvParser from "csv-parser";
import moment from "moment";
import path from "path";
import { getSalesHandler } from "./sales";
import { binarySearch, calculateDaysOverdue } from "./utils";

const app = express();
const port = 8080;

// CSV uses a mix of camel case and snake case, ideally transform these
export type OrderCSVdata = {
  Id: number;
  storeId: string;
  orderId: number;
  latest_ship_date: string;
  shipment_status: string;
  destination: string;
  items: number;
  orderValue: number;
};

let stores: Map<string, any> = new Map();
let overdueOrders: OrderCSVdata[] = [];
const storesCsvPath = path.resolve(__dirname, "..", "data", "stores.csv");
const ordersCsvPath = path.resolve(__dirname, "..", "data", "orders.csv");

/* 
Optimisations
 - filter and cache overdue orders - filter overdue orders during initalisation so the endpoint only traverses
   cached overdue orders rather than the entire csv directly.
 - binary search - to handle the large array when initally sorting into ascending order.
 - efficient sorting, sorting only micro arrays, no expensive sorts.
*/
fs.createReadStream(storesCsvPath)
  .pipe(csvParser())
  .on("data", (row: any) => {
    stores.set(row.storeId, row);
  });

fs.createReadStream(ordersCsvPath)
  .pipe(csvParser())
  .on("data", (row: OrderCSVdata) => {
    if (
      moment(row.latest_ship_date, "DD/MM/YYYY").isBefore(moment()) &&
      row.shipment_status === "Pending"
    ) {
      const daysOverdue = calculateDaysOverdue(row);
      const index = binarySearch(overdueOrders, daysOverdue);
      overdueOrders.splice(index, 0, row);
    }
  });

app.use(cors());
app.get("/user", getUser);
app.get("/sales", getSalesHandler(overdueOrders, stores));

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
