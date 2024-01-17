import React from "react";
import CustomersSidebar from "../../Components/Customers/CustomersSidebar";
import GamingConsoleContent from "../../Components/Customers/GamingConsoleContent";

const GamingConsolePage = () => {
  return (
    <>
      <CustomersSidebar component={<GamingConsoleContent />} />
    </>
  );
};

export default GamingConsolePage;
