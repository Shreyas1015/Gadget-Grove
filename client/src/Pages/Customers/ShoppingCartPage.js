import React from "react";
import CustomersSidebar from "../../Components/Customers/CustomersSidebar";
import ShoppingCartContent from "../../Components/Customers/ShoppingCartContent";

const ShoppingCartPage = () => {
  return (
    <>
      <CustomersSidebar component={<ShoppingCartContent />} />
    </>
  );
};

export default ShoppingCartPage;
