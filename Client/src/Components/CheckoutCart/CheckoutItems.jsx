import React, { useEffect } from "react";
import cart, { removeFromCart } from "../../Redux/cart";
import { useDispatch, useSelector } from "react-redux";
const CheckoutItems = ({ item }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(item);
  }, [item]);

  const handleRemoveItem = () => {
    dispatch(removeFromCart(item.campaignId));
  };

  return (
    <>
      <div className="cartItem">
        <div className="cartItem-title">
          <div>
            <img src={item.imgUrl} />
          </div>
          <div className="cartItem-desc">
            <span>{item.name}</span>

            <p>{item.schedule ? "Subscription" : "One Time Payment"}</p>
          </div>
        </div>

        <div className="cartItem-price">
          <button onClick={handleRemoveItem}>x</button>

          <span>${item.amount.toLocaleString()}</span>
        </div>
      </div>
    </>
  );
};

export default CheckoutItems;
