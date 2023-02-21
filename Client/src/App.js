import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Switch,
  useParams,
} from "react-router-dom";
import Homepage from "./Homepage";
import ID1 from "./ID1/ID1";
import ID2 from "./ID2/ID2";
import ID3 from "./ID3/ID3";
import PaymentSuccess from "./PaymentSuccess/PaymentSuccess";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/:id" element={<Homepage />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/paymentSuccess/:id" element={<PaymentSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;
