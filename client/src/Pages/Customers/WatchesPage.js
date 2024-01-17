import React from "react";
import CustomersSidebar from "../../Components/Customers/CustomersSidebar";
import WatchesContent from "../../Components/Customers/WatchesContent";

const WatchesPage = () => {
  return (
    <>
      <CustomersSidebar component={<WatchesContent />} />
    </>
  );
};

export default WatchesPage;
