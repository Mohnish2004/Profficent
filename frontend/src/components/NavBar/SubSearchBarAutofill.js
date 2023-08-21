import React, { useRef, useState } from "react";
import SubSearchBar from "./SubSearchBar";
import SearchDataList from "./SearchDataList";
import "../../css/navbar/subSearchBarAutofill.css";

function SubSearchBarAutofill(props) {
    const {
        choices,
        // children,
        limit,
        onListItemClick,
        ...additionalProps
    } = props;

    const [showList, setShowList] = useState(false);
    const inputRef = useRef();
    const inputElem = inputRef.current;

    const onListItemClickCombined = value => {
        if(!inputElem) { return; }
        inputElem.value = value;
        setShowList(false);
        onListItemClick(value);
    };

    return (
        <SubSearchBar
            ref={inputRef}
            onFocus={() => setShowList(true)}
            {...additionalProps}
        >
            <SearchDataList
                show={showList}
                choices={choices}
                limit={limit}
                onClick={onListItemClickCombined}
            />
        </SubSearchBar>
    );
}

export default SubSearchBarAutofill;