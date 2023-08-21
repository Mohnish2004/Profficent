import React from "react";
import searchIcon from "../../images/icons/searchIcon.svg";
import "../../css/navbar/searchIcon.css";

function SearchIcon(props) {
    const {
        className = "",
        ...additionalProps
    } = props;

    return (
        <div className={`search-icon ${className}`} role="button" {...additionalProps}>
            <img src={searchIcon} alt="Search Icon" className="search-icon-img"/>
        </div>
    );
}

export default SearchIcon;