import React from "react";
import { useParams } from "react-router-dom";
import Header from "../Components/Navbars/Header";
import Footer from "../Components/Navbars/Footer";
import "../index.css";
import ID1 from "../ID1/ID1";
import ID3 from "../ID3/ID3";
const ID2 = () => {
  let params = useParams();
  console.log(params);
  return (
    <>
      <div className="homepage">
        <div>ID2</div>
      </div>

      {/* <Footer /> */}
    </>
  );
};

export default ID2;
