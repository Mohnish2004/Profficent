import React from "react";
import SearchDataListItem from "./SearchDataListItem";
import "../../css/navbar/searchDataList.css";

function SearchDataList({ choices, limit = 7, onClick, show }) {
    const onItemClick = onClick || (() => {});
    return choices &&
        <div
            className={`search-data-list ${show ? "search-data-list-show" : ""}`}
            role="menu"
        >
            {choices.slice(0, limit)
                .map(dataValue =>
                    <SearchDataListItem
                        key={dataValue}
                        value={dataValue}
                        onClick={onItemClick}
                    />
                )
            }
        </div>
    ;
}

export default SearchDataList;