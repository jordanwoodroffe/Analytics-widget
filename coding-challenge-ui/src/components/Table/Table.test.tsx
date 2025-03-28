import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import MovieTable from ".";

test("Render table correctly", () => {
  render(
    <Router>
      <MovieTable />
    </Router>
  );
  const marketplaceHeader = screen.getByText("Marketplace");
  const storeHeader = screen.getByText("Store");
  const orderIdHeader = screen.getByText("Order ID");
  const orderValueHeader = screen.getByText("Order Value");
  const itemsHeader = screen.getByText("Items");
  const destinationHeader = screen.getByText("Destination");

  expect(marketplaceHeader).toBeInTheDocument();
  expect(storeHeader).toBeInTheDocument();
  expect(orderIdHeader).toBeInTheDocument();
  expect(orderValueHeader).toBeInTheDocument();
  expect(itemsHeader).toBeInTheDocument();
  expect(destinationHeader).toBeInTheDocument();
});
