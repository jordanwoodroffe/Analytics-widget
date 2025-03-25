import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import MovieTable from "./components/Table";

const App = () => {
  return (
    <Router>
      <MovieTable />
    </Router>
  );
};

export default App;
