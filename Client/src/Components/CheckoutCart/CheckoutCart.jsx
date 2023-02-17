import React from "react";
import "./CheckoutCart.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
const CheckoutCart = () => {
  return (
    <>
      <div className="CheckoutCart">
        <div className="CheckoutCart-inner">
          <div className="CheckoutCart-container">
            <div className="CheckoutCart-header">
              <h5>CHECKOUT CART</h5>
              <span>
                This holiday season, your gift will be matched to provide double
                the lifesaving assistance.
              </span>
            </div>
            <div className="CheckoutCart-body">
              <div className="CheckoutCart-body-left">
                <div className="body-left-personal">
                  <h3>Personal Details</h3>

                  <Box
                    component="form"
                    sx={{
                      "& .MuiTextField-root": { m: 1, width: "100%" },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <div>
                      <TextField
                        required
                        id="outlined-required"
                        label="Full Name"
                        defaultValue=""
                      />
                    </div>
                    <div>
                      <TextField
                        required
                        id="outlined-required"
                        label="Email"
                        defaultValue=""
                      />
                    </div>
                    <div>
                      <TextField
                        required
                        id="outlined-required"
                        label="Phone Number"
                        defaultValue=""
                      />
                    </div>
                  </Box>
                </div>
                <div className="body-left-shipping">
                  <h3>Billing Details</h3>
                  <Box
                    component="form"
                    sx={{
                      "& .MuiTextField-root": { m: 1, width: "100%" },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <div>
                      <TextField
                        required
                        id="outlined-required"
                        label="Street Address"
                        defaultValue=""
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <TextField
                        required
                        id="outlined-required"
                        label="City"
                        defaultValue=""
                      />
                      <TextField
                        required
                        id="outlined-required"
                        label="Zip Code"
                        defaultValue=""
                      />
                    </div>
                    <div>
                      <TextField
                        required
                        id="outlined-required"
                        label="Country"
                        defaultValue=""
                      />
                    </div>
                  </Box>
                </div>
                <div className="body-left-payments"></div>
              </div>
              <div className="CheckoutCart-body-right">
                <div className="body-right-summary"></div>
                <div className="body-right-totals"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutCart;
