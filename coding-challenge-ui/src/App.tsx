import React, { useState } from "react";
import styled from "styled-components";
import OverdueOrdersTable from "./components/Table";
import { ChakraProvider, Text } from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";

const AppWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  position: fixed;
  onwheel: (event) => event.stopPropagation();
  background-color: #f4f4f4;
`;

const AppHeader = styled.div`
  background-color: #805ad5;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px 24px 32px;
`;

const TableContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
`;

interface User {
  firstName: string;
  lastName: string;
  email: string;
  id: number;
}

const App = () => {
  const [user, setUser] = useState<User | null>(null);

  React.useEffect(() => {
    // Proxy is setup in package.json
    fetch("/user")
      .then((results) => results.json())
      .then((data) => {
        setUser(data);
      });
  }, []);

  return (
    <Router>
      <ChakraProvider>
        <AppWrapper>
          <AppHeader>
            <Text fontWeight={500}>Analytics Dashboard</Text>
            <Text>Welcome, {user ? user.firstName : "Guest"}!</Text>
          </AppHeader>
          <TableContainer>
            <OverdueOrdersTable />
          </TableContainer>
        </AppWrapper>
      </ChakraProvider>
    </Router>
  );
};

export default App;
