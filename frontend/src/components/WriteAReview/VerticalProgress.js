import { Fragment } from "react";
import "../../css/verticalProgress.css";

function Bullet({ children }) {
    return (
        <div className="vertical-progress-bullet-wrapper">
            <div className="vertical-progress-circle">
                {children}
            </div>
        </div>
    );
}

function SubBullet({ started }) {
    return (
        <div className="vertical-progress-bullet-wrapper">
            <div
                className={`vertical-progress-sub-circle-bar ${started ? "vertical-progress-sub-circle-bar-green" : ""}`}/>
            <div
                className={`vertical-progress-sub-circle ${started ? "vertical-progress-sub-circle-outline-green" : ""}`}/>
        </div>
    );
}

function MainText({ children }) {
    return (
        <span className="vertical-progress-main-text">
            {children}
        </span>
    );
}

function SubText({ children }) {
    return (
        <span className="vertical-progress-sub-text">
            {children}
        </span>
    );
}

function MainProgressPoint({ number, started, complete, children }) {
    const optionalClass = complete ? "complete-progress-point" : started ? "started-progress-point" : "";
    return (
        <div className={`vertical-progress-row vertical-progress-main-point ${optionalClass}`}>
            <Bullet>{complete ? "✔" : number}</Bullet>
            <MainText>{children}</MainText>
        </div>
    );
}

function SubProgressPoint({ children, started, complete }) {
    const optionalClass = complete ? "complete-progress-point" : started ? "started-progress-point" : "";
    return (
        <div className={`vertical-progress-row vertical-progress-sub-point ${optionalClass}`}>
            <SubBullet/>
            <SubText>{children}</SubText>
        </div>
    );
}

export default function VerticalProgress({ data }) {
    let allComplete = true;
    return (
        <div className="vertical-progress">
            {data.map((mainPoint, index) => {
                allComplete = allComplete && mainPoint.complete;
                return (
                    <Fragment key={index + 1}>
                        <MainProgressPoint
                            number={index + 1}
                            started={mainPoint.started}
                            complete={mainPoint.complete}
                        >
                            {mainPoint.title}
                        </MainProgressPoint>
                        {
                            mainPoint.started && !mainPoint.complete
                                ?
                                mainPoint.subpoints.map((subpoint, index) => {
                                    return (
                                        <SubProgressPoint key={index} complete={subpoint.complete}
                                            started={mainPoint.started}>
                                            {subpoint.title}
                                        </SubProgressPoint>
                                    );
                                })
                                :
                                <div className="progress-empty-line">
                                    <div className="vertical-progress-bullet-wrapper">
                                        <div className={`vertical-progress-sub-circle-bar ${mainPoint.complete ? "vertical-progress-sub-circle-bar-green" : ""}`}/>
                                    </div>
                                </div>
                        }
                    </Fragment>
                );
            })}
            <MainProgressPoint complete={allComplete} number={data.length + 1}>Submit</MainProgressPoint>
        </div>
    );
}