import React, {
  CSSProperties,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
} from "@chakra-ui/react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";

type Order = {
  marketplace: string;
  shopName: string;
  orderId: string;
  orderValue: number;
  items: number;
  destination: string;
  daysOverdue: number;
};

const OverdueOrdersTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [sort, setSort] = useState("asc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const location = useLocation();
  const navigate = useNavigate();
  const isFirstRender = useRef(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlSort = params.get("sort") || sort;
    const urlPage = params.get("page") ? Number(params.get("page")) : page;
    const urlLimit = params.get("limit") ? Number(params.get("limit")) : limit;

    setSort(urlSort);
    setPage(urlPage);
    setLimit(urlLimit);

    fetch(`/sales?sort=${urlSort}&limit=${urlLimit}&page=${urlPage}`)
      .then((response) => response.json())
      .then((data) => setOrders(data));
  }, [location.search]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const params = new URLSearchParams();
    params.set("sort", sort);
    params.set("limit", String(limit));
    params.set("page", String(page));
    navigate(`?${params.toString()}`);
  }, [sort, page, limit, navigate]);

  const handleSortChange = () => {
    setSort(sort === "asc" ? "dsc" : "asc");
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const StyledButton = styled.div`
    backgroundcolor: transparent;
    cursor: pointer;
    user-select: none;
  `;

  const StyledTableContainer = styled(TableContainer)`
    border: 1px solid #805ad5;
    border-radius: 12px;
    width: 100%;
  `;

  const StyledButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    position: sticky;
    right: 0;
    margin-top: 12px;
    width: -webkit-fill-available;
  `;

  const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: -webkit-fill-available;
  `;

  const StyledTh = ({ children }: { children: ReactNode }) => {
    return <Th css={{ borderBottomColor: "#805ad5" }}>{children}</Th>;
  };

  const StyledTd = ({
    children,
    style,
  }: {
    children: ReactNode;
    style?: CSSProperties;
  }) => {
    return <Td css={{ borderBottomColor: "#dddada", ...style }}>{children}</Td>;
  };

  return (
    <Container>
      <StyledTableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <StyledTh>Marketplace</StyledTh>
              <StyledTh>Store</StyledTh>
              <StyledTh>Order ID</StyledTh>
              <StyledTh>Order Value</StyledTh>
              <StyledTh>Items</StyledTh>
              <StyledTh>Destination</StyledTh>
              <StyledTh>
                <StyledButton onClick={handleSortChange}>
                  Days Overdue&nbsp; {sort === "asc" ? "↑" : "↓"}
                </StyledButton>
              </StyledTh>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((order) => (
              <Tr key={order.orderId}>
                <StyledTd>{order.marketplace}</StyledTd>
                <StyledTd>{order.shopName}</StyledTd>
                <StyledTd>{order.orderId}</StyledTd>
                <StyledTd>{`$${order.orderValue}`}</StyledTd>
                <StyledTd>{order.items}</StyledTd>
                <StyledTd>{order.destination}</StyledTd>
                <StyledTd style={{ color: "red", fontWeight: 600 }}>
                  {order.daysOverdue}
                </StyledTd>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </StyledTableContainer>
      <StyledButtonContainer>
        <Button
          onClick={() => handlePageChange(page - 1)}
          isDisabled={page === 1}
          colorScheme="purple"
          marginRight="8px"
        >
          Previous
        </Button>
        <Button onClick={() => handlePageChange(page + 1)} colorScheme="purple">
          Next
        </Button>
      </StyledButtonContainer>
    </Container>
  );
};

export default OverdueOrdersTable;
