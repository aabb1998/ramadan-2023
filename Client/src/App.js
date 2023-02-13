import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Switch,
  useParams,
} from "react-router-dom";
import Homepage from "./Components/Homepage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/:id" element={<Homepage />} />
      </Routes>
    </Router>
  );
}

export default App;
