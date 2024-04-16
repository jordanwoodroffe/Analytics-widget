import request from "supertest";
import express from "express";
import { getSalesHandler } from "./sales";
import { OrderCSVdata } from ".";
import moment from "moment";

const app = express();
const overdueOrders: OrderCSVdata[] = [
  {
    Id: 1,
    orderId: 1,
    orderValue: 100,
    storeId: "store1",
    latest_ship_date: "01/01/2022",
    shipment_status: "Pending",
    items: 1,
    destination: "Location1",
  },
  {
    Id: 2,
    orderId: 2,
    orderValue: 200,
    storeId: "store2",
    latest_ship_date: "02/01/2022",
    shipment_status: "Pending",
    items: 2,
    destination: "Location2",
  },
  {
    Id: 3,
    orderId: 3,
    orderValue: 300,
    storeId: "store3",
    latest_ship_date: "03/01/2022",
    shipment_status: "Pending",
    items: 3,
    destination: "Location3",
  },
];
const stores: Map<string, any> = new Map([
  ["store1", { marketplace: "Marketplace1", shopName: "Shop1" }],
  ["store2", { marketplace: "Marketplace2", shopName: "Shop2" }],
  ["store3", { marketplace: "Marketplace3", shopName: "Shop3" }],
]);

app.get("/sales", getSalesHandler(overdueOrders, stores));

describe("GET /sales", () => {
  it("should return sales in ascending order by default", async () => {
    const res = await request(app).get("/sales");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body[0].orderValue).toBe(100);
    expect(res.body[1].orderValue).toBe(200);
    expect(res.body[2].orderValue).toBe(300);
  });

  it("should return sales in descending order when sort=dsc", async () => {
    const res = await request(app).get("/sales?sort=dsc");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body[0].orderValue).toBe(300);
    expect(res.body[1].orderValue).toBe(200);
    expect(res.body[2].orderValue).toBe(100);
  });

  it("should verify all overdue orders are actually overdue", () => {
    overdueOrders.forEach((order) => {
      expect(
        moment(order.latest_ship_date, "DD/MM/YYYY").isBefore(moment()) &&
          order.shipment_status === "Pending"
      ).toBeTruthy();
    });
  });
});
