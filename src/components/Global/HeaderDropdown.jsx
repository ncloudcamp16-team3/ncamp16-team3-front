import React from "react";
import Bookmark from "../../assets/images/Global/modal-bookmark.svg";
import Calendar from "../../assets/images/Global/modal-calendar.svg";
import Info from "../../assets/images/Global/modal-info.svg";
const HeaderDropdown = () => {
    return (
        <div>
            <img src={Bookmark} />
            <img src={Calendar} />
            <img src={Info} />
        </div>
    );
};

export default HeaderDropdown;
