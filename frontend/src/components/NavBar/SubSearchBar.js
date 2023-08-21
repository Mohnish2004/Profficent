import React, { forwardRef, useRef } from "react";
import "../../css/navbar/subSearchBar.css";

function SubSearchBar(props, forwardInputRef) {
    const {
        className = "",
        onClear,
        children,
        onBlur,
        ...additionalProps
    } = props;

    const defaultInputRef = useRef();
    const inputRef = forwardInputRef || defaultInputRef;
    const inputElem = inputRef.current;
    const displayX = inputElem?.value;
    const onClearFunc = onClear || (() => {});

    const combinedOnClear = e => {
        inputElem.value = "";
        onClearFunc(e);
    };

    return (
        <div
            className={`sub-search-bar ${className}`}
            onBlur={onBlur}
        >
            <input
                ref={inputRef}
                className="sub-search-bar-input"
                type="text"
                {...additionalProps}
            />
            {displayX &&
                <div
                    className="sub-search-bar-clear-x"
                    onClick={combinedOnClear}
                    role="button"
                >
                    <span>✖</span>
                </div>
            }
            {children}
        </div>
    );
}

export default forwardRef(SubSearchBar);