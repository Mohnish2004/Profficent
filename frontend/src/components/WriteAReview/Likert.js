import React, { useState } from "react";
import "../../css/forms/Likert.css";

export default function Likert({ defaultVal, onValueChange }) {
    const [scaleVal, setScaleVal] = useState(defaultVal || 0);

    const setScale = val => () => {
        setScaleVal(val);
        if(typeof onValueChange === "function") {
            onValueChange(val);
        }
    };

    return (
        <div className="likert-container" tabIndex="0">
            <div>
                <div className={scaleVal < 1 ? "" : "active"} onClick={setScale(1)}/>
            </div>
            <div>
                <div className={scaleVal < 2 ? "" : "active"} onClick={setScale(2)}/>
            </div>
            <div>
                <div className={scaleVal < 3 ? "" : "active"} onClick={setScale(3)}/>
            </div>
            <div>
                <div className={scaleVal < 4 ? "" : "active"} onClick={setScale(4)}/>
            </div>
            <div>
                <div className={scaleVal < 5 ? "" : "active"} onClick={setScale(5)}/>
            </div>
        </div>
    );
}