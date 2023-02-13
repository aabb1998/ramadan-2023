import React from "react";
import { useParams } from "react-router-dom";
import Header from "./Components/Navbars/Header";
import Footer from "./Components/Navbars/Footer";
import "./index.css";
const Homepage = () => {
  let params = useParams();
  console.log(params);
  return (
    <>
      <div className="homepage">
        <Header />
      </div>

      {/* <Footer /> */}
    </>
  );
};

export default Homepage;
