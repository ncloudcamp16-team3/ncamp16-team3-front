import React from "react";
import PetSta from "./PetSta.jsx";
import FollowProvider from "../../context/FollowContext.jsx";

const PetstaMain = () => {
    return (
        <FollowProvider>
            <PetSta />
        </FollowProvider>
    );
};

export default PetstaMain;
