import React from "react";
import { ProgressBar, Step } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";
import "../../css/customProgressBar.css";

function CustomProgress({ percentage, labels }) {
    // TODO: Remove index from key (Is fine here but still bad style)
    return (
        <ProgressBar
            height={10}
            percent={Math.min(percentage, 100)}
            unfilledBackground="#EDEDED"
            filledBackground="#00A1FF"
        >
            {labels.map((label, index) =>
                <Step transition="scale" key={`${label}-${index}`}>
                    {({ accomplished }) =>
                        <div className={`progress-bullet ${accomplished ? "accomplished" : ""}`}>
                            <div className="bullet-text-container">
                                {label}
                            </div>
                        </div>
                    }
                </Step>
            )}

        </ProgressBar>
    );
}

export default CustomProgress;