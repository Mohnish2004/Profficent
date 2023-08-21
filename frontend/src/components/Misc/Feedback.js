import { useState } from "react";
import "../../css/feedback.css";

export default function FeedbackCard() {
    const [show, setShow] = useState(false);
    const [feedbackText, setFeedbackText] = useState("");
    const [category, setCategory] = useState("");

    return (
        <>
            <div className="feedback-toggle" onClick={() => setShow(!show)}>
                Feedback
            </div>
            {show &&
                <div className="feedback">
                    <h2 className="feedback-title">Send us feedback!</h2>
                    <p>Found a bug? Have a suggestion? Fill out the form below and we’ll take a look.</p>
                    <textarea
                        className="feedback-entry"
                        placeholder="Type here"
                        value={feedbackText}
                        onChange={e => setFeedbackText(e.target.value)}
                    />

                    <p>Select your feedback category</p>
                    <div className="feedback-categories">
                        {["Bug", "Comment", "Other"].map(val =>
                            <div
                                className={val === category ? "selected-feedback-category" : "feedback-category"}
                                onClick={() => setCategory(val)}
                                key={val}
                            >
                                {val}
                            </div>
                        )}
                    </div>
                    <div className="feedback-footer">
                        <div>Aggie Review</div>
                        <div>Submit</div>
                    </div>
                </div>
            }
        </>
    );
}