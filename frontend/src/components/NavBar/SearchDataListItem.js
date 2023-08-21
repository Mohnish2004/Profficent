import React from "react";
import "../../css/navbar/searchDataListItem.css";

function SearchDataListItem({ value, onClick }) {
    const onItemClick = () => onClick(value);

    return (
        <div
            className="search-data-list-item"
            role="menuitem"
            onClick={onItemClick}
        >
            <p>{value}</p>
        </div>
    );
}

export default SearchDataListItem;