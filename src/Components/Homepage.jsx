import React from "react";
import { useParams } from "react-router-dom";

const Homepage = () => {
  let params = useParams();
  console.log(params);
  return <div>MyComponent</div>;
};

export default Homepage;
