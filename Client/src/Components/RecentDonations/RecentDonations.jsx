import React from "react";
import "./RecentDonations.css";

const RecentDonations = () => {
  let recentDonations = [
    {
      name: "Abdul J",
      amount: 232,
      location: "Sydney, Australia",
      campaign: "Mosque",
    },
    {
      name: "Haytch R",
      amount: 232,
      location: "Canberra, Australia",
      campaign: "Orphan",
    },
    {
      name: "Poeyr A",
      amount: 232,
      location: "Perth, Australia",
      campaign: "Hatych",
    },
  ];

  return (
    <>
      <div className="MainUpsellSection">
        <div className="MainDonationSection-inner">
          <div className="MainDonationSection-container">
            <div className="RecentDonations-inner">
              <div className="MainDonationSection-header">
                <div>
                  <h5 style={{ fontSize: "45px" }}>RECENT DONATIONS</h5>

                  <span>See who's supporting our cause.</span>
                </div>
                <div></div>
                <div className="RecentDonations-desc">
                  <span>
                    In this section, you can see the impact of your donations.
                    We believe in giving back to the community, and we want to
                    keep our customers informed about the causes we support. We
                    believe in transparency and accountability, and we want to
                    share our philanthropic efforts with our customers.
                    Together, we can make a positive change in the world.
                  </span>
                </div>
              </div>
              <div className="RecentDonations-donations">
                {recentDonations.map((donation, index) => (
                  <div className="RecentDonations-donation">
                    <span>{donation.name}</span>
                    <span>${donation.amount}</span>
                    <span>{donation.campaign}</span>
                    <span>{donation.location}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecentDonations;
