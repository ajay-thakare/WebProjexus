import Loading from "@/components/global/loading";
import React from "react";

const loadingAgencyPage = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Loading />
    </div>
  );
};

export default loadingAgencyPage;
