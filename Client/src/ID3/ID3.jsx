import React from "react";
import { useParams } from "react-router-dom";
import Header from "../Components/Navbars/Header";
import Footer from "../Components/Navbars/Footer";
import "../index.css";
const ID3 = () => {
  let params = useParams();
  console.log(params);
  return (
    <>
      <div className="homepage">
        <div>ID3</div>
      </div>

      {/* <Footer /> */}
    </>
  );
};

export default ID3;
