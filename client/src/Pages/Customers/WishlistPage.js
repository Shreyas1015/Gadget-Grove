import React from "react";
import WishlistContent from "../../Components/Customers/WishlistContent";
import CustomersSidebar from "../../Components/Customers/CustomersSidebar";

const WishlistPage = () => {
  return (
    <>
      <CustomersSidebar component={<WishlistContent />} />
    </>
  );
};

export default WishlistPage;
