import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Components/Navbars/Header";
import Footer from "./Components/Navbars/Footer";
import "./index.css";
import ID1 from "./ID1/ID1";
import ID2 from "./ID2/ID2";
import ID3 from "./ID3/ID3";
import { getAllCampaigns } from "./FirebaseFunctions/FirebaseFunctions";
const Homepage = () => {
  const [userData, setUserData] = useState();
  const [mainCampaign, setMainCampaign] = useState();
  const [otherCampaigns, setOtherCampaigns] = useState();
  const [placeholderParam, setPlaceholderParam] = useState("P0Vz0&C&m4Ozq^2d");
  const [mainPlaceholder, setMainPlaceholder] = useState(null);
  const [secondaryPlaceholder, setSecondaryPlaceholder] = useState(null);

  let params = useParams();
  console.log(params);

  useEffect(() => {
    getAll();
  }, []);

  const getAll = async () => {
    let allData = await getAllCampaigns();
    console.log(allData);

    if (allData) {
      let mainCampaign = allData.find((item) => item.campaignId === params.id);
      if (mainCampaign) {
        setMainCampaign(mainCampaign);
        const filteredArray = allData.filter(
          (item) => item.campaignId !== params.id
        );
        setOtherCampaigns(filteredArray);
        console.log(mainCampaign);
        console.log(otherCampaigns);
      } else {
        const firstArray = allData.slice(0, 1);
        const secondArray = allData.slice(1);
        console.log(firstArray);
        console.log(secondArray);
        setMainCampaign(firstArray[0]);
        setOtherCampaigns(secondArray);
      }
    }
  };

  useEffect(() => {
    console.log(otherCampaigns);
  }, [otherCampaigns]);

  return (
    <>
      <div className="homepage">
        <Header />
        {params.id === "P0Vz0&C&m4Ozq^2d" && (
          <ID1 mainCampaign={mainCampaign} otherCampaigns={otherCampaigns} />
        )}
        {params.id === "Fa0dAUne*T*v&iaT" && (
          <ID1 mainCampaign={mainCampaign} otherCampaigns={otherCampaigns} />
        )}
        {params.id === "n^s@NVJ!CNyYemn&" && (
          <ID1 mainCampaign={mainCampaign} otherCampaigns={otherCampaigns} />
        )}
        {params.id === "GP6M0f8r1akdl8A2" && (
          <ID1 mainCampaign={mainCampaign} otherCampaigns={otherCampaigns} />
        )}
        {params.id !== "P0Vz0&C&m4Ozq^2d" &&
          params.id !== "Fa0dAUne*T*v&iaT" &&
          params.id !== "n^s@NVJ!CNyYemn&" &&
          params.id !== "GP6M0f8r1akdl8A2" && (
            <ID1 mainCampaign={mainCampaign} otherCampaigns={otherCampaigns} />
          )}

        <Footer />
      </div>

      {/* <Footer /> */}
    </>
  );
};

export default Homepage;
