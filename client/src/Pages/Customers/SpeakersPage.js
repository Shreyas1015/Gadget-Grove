import React from "react";
import CustomersSidebar from "../../Components/Customers/CustomersSidebar";
import SpeakersContent from "../../Components/Customers/SpeakersContent";

const SpeakersPage = () => {
  return (
    <>
      <CustomersSidebar component={<SpeakersContent />} />
    </>
  );
};

export default SpeakersPage;
