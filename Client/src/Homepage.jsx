import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Components/Navbars/Header";
import Footer from "./Components/Navbars/Footer";
import "./index.css";
import ID1 from "./ID1/ID1";
import ID2 from "./ID2/ID2";
import ID3 from "./ID3/ID3";
const Homepage = () => {
  const [userData, setUserData] = useState();

  let params = useParams();
  console.log(params);

  useEffect(() => {
    fetch("https://test.alihsan.org.au/wp-json/wp/v2/users/me", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setUserData(data));
  }, []);

  return (
    <>
      <div className="homepage">
        <Header />
        {params.id === "P0Vz0&C&m4Ozq^2d" && <ID1 />}
        {params.id === "Fa0dAUne*T*v&iaT" && <ID2 />}
        {params.id === "n^s@NVJ!CNyYemn&" && <ID3 />}
        {params.id != "P0Vz0&C&m4Ozq^2d" ||
        params.id != "Fa0dAUne*T*v&iaT" ||
        params.id != "n^s@NVJ!CNyYemn&" ? (
          <ID1 />
        ) : (
          <></>
        )}
        <Footer />
      </div>

      {/* <Footer /> */}
    </>
  );
};

export default Homepage;
