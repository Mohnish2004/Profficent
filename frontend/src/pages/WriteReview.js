import { useEffect, useState } from "react";
import { Card, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import useCapturedState, { ImmediateCapturedProvider, useCapturedProviderValue } from "use-captured-state";
import { combineValidators, isDivisibleBy, isGreaterThan, isLessThan, isNotLongerThan, isPositive, noBadWords, wordLen } from "../utils/changeValidators";
import useUserObj from "../utils/useUserObj";
import Likert from "../components/WriteAReview/Likert";
import VerticalProgress from "../components/WriteAReview/VerticalProgress";
import "../css/createReview.css";
import axios from "axios";

/**
 * Convenient function for creating options in select inputs
 * @param {string} label Label for select option
 * @param {string} [value] Defaults to same as label
 * @returns {SelectOption} Returns a SelectOption object
 */
function option(label, value) {
    return {
        label: label, value: value !== undefined ? value : label
    };
}

/**
 * @typedef {Object} CardSectionData - A section of a form
 * @property {string} title Title of the card
 * @property {string} subtitle Description under the title of the card
 * @property {InputSet[]} inputSets Array of input sets for the card to render
 */

/**
 * @typedef {Object} InputSet - An input group inside a card
 * @property {string} title Title of the input group
 * @property {string} subtitle Description under the title of the input group
 * @property {(TextInput|SelectInput|Object)[]} inputs The actual input data in the input set
 */

/**
 * @typedef {Object} TextInput - Object for configuring a text input
 * @property {string} type=text Type of text input to use. Extra types: textarea, likert
 * @property {string} name Name of input for form submission
 * @property {string} defaultValue Default value to use
 * @property {string} [placeholder] Placeholder to show in input
 * @property {Validator[]} [validators = []] Array of validators to be combined. Order may matter
 */

/**
 * @typedef {Object} SelectInput - Object for configuring a text input
 * @property {string} type=select Indicates that a select input should be displayed
 * @property {string} name Name of input for form submission
 * @property {string} defaultValue Default value to use
 * @property {string} [placeholder] Placeholder to show in select
 * @property {SelectOption[]} Array of options for the select
 * @property {Validator[]} [validators = []] Array of validators to be combined. Order may matter. Not very useful with this type
 */

/**
 * @typedef {Object} SelectOption
 * @property {string} label What to display as the option
 * @property {string} value What to use as the actual value of the option
 */

/**
 * Array of cards to display
 * @type {CardSectionData[]}
 */
const cards = [// Course Questions Section
    {
        title: "Course Questions",
        subtitle: "Help your Aggie Peers gain a better understanding of the course.",
        inputSets: [{
            title: "Course", subtitle: "When did you take this course?", inputs: [{
                type: "select",
                name: "quarter",
                defaultValue: "",
                placeholder: "-- Select Quarter --",
                options: [option("Fall", "FQ"), option("Winter", "WQ"), option("Spring", "SQ"), option("Summer Session 1", "SS1"), option("Summer Session 2", "SS2"),]
            }, {
                type: "number",
                name: "year",
                defaultValue: "",
                placeholder: "Year",
                validators: [isPositive, isDivisibleBy(1), isGreaterThan(1999), isLessThan(3000)]
            }]
        }, {
            title: "Format", subtitle: "How was this course taught?", inputs: [{
                type: "select",
                name: "format",
                defaultValue: "",
                placeholder: "-- Select Format --",
                options: [option("In-person", "in-person"), option("Online", "online"), option("Hybrid", "hybrid"),]
            }]
        }, {
            title: "Grade", subtitle: "What grade did you receive?", inputs: [{
                type: "select",
                name: "grade",
                defaultValue: "",
                placeholder: "-- Select --",
                options: [option("A+"), option("A"), option("A-"), option("B+"), option("B"), option("B-"), option("C+"), option("C"), option("C-"), option("D+"), option("D"), option("D-"), option("F")]
            }]
        }]
    },

    // Midterm Section
    {
        title: "Midterms and Exams",
        subtitle: "How well did the midterms reflect the material of the course?",
        inputSets: [{
            // title: "Related content",
            // subtitle: "Does the midterm material relate to what you have learn?",
            inputs: [{
                type: "likert", name: "midterm", defaultValue: 0, validators: [isGreaterThan(0)]
            }]
        }]
    },

    // Workload Section
    {
        title: "Workload",
        subtitle: "Is the workload in this course manageable?",
        inputSets: [{
            // title: "Management", subtitle: "Is the workload in this course manageable?",
            inputs: [{
                type: "likert", name: "workload", defaultValue: 0, validators: [isGreaterThan(0)]
            }]
        }]
    },

    // Lecture Section
    {
        title: "Lecture",
        subtitle: "What would you rate the quality of the lectures?",
        inputSets: [{
            // title: "Engagement", subtitle: "Is the lecture content engaging?",
            inputs: [{
                type: "likert", name: "lecture", defaultValue: 0, validators: [isGreaterThan(0)]
            }]
        }]
    },

    // Written Response Section
    {
        title: "Written Response", subtitle: "Elaborate on your experience with the course.",
        inputSets: [{
            inputs: [{
                type: "textarea", name: "written", validators: [noBadWords, isNotLongerThan(100)]
            }]
        }]
    }];

function CustomizedFormCard({ title, description, children }) {
    return <Card className="customized-form-card">
        <Card.Body>
            <Card.Title className="customized-form-card-title">{title}</Card.Title>
            <Card.Text>
                {description}
            </Card.Text>
            <div className="customized-form-card-inputs">
                {children}
            </div>
        </Card.Body>
    </Card>;
}

function CustomInputSet({ title, description, children }) {
    return <div className="custom-input-set">
        <h3 className="custom-input-set-title">{title}</h3>
        <p className="custom-input-set-description">{description}</p>
        <div className="custom-input-set-entries">
            {children}
        </div>
    </div>;
}

function CardSection({ content }) {
    return <CustomizedFormCard
        title={content.title}
        description={content.subtitle}
    >
        {content.inputSets.map(content => <InputSetSection key={content.title} content={content}/>)}
    </CustomizedFormCard>;
}

function InputSetSection({ content }) {
    return <CustomInputSet
        title={content.title}
        description={content.subtitle}
    >
        {content.inputs.map(content => <SwitchFormControl key={content.name} content={content}/>)}
    </CustomInputSet>;
}

function combineAndValidate(value = "", validators = []) {
    const validator = combineValidators(validators);
    return {
        valid: value.length !== 0 && validator(value), invalid: value.length !== 0 && !validator(value)
    };
}

function FilteredTextArea(modifiedProps) {
    const hideError = noBadWords(modifiedProps.value);
    const valueLen = wordLen(modifiedProps.value);

    return (
        <>
            <div className="filtered-text-area-container">
                <div className="custom-form-textarea">
                    <Form.Control
                        {...modifiedProps}
                        className={modifiedProps.className}
                        type="text"
                        as="textarea"
                        style={{ resize: "none", margin: 0 }}
                        rows={5}
                    />
                    <span className={`custom-form-textarea-word-count ${!isNotLongerThan(100)(modifiedProps.value) ? "too-long" : ""}`}>{valueLen}/100 Words</span>
                </div>
                <div className={`filtered-text-area-error-box ${hideError ? "hide-error-box" : ""}`}>
                    Reminder: Inappropriate words may not be included in reviews on this platform
                </div>
            </div>
        </>
    );
}

function CustomizedLikert({ onChange }) {
    return <Likert onValueChange={onChange}/>;
}

function SwitchFormControl({ content }) {
    const defaultVal = content.defaultValue !== undefined ? content.defaultValue : "";
    const [capturedValue, setCapturedValue] = useCapturedState(content.name, {
        value: defaultVal, ...combineAndValidate(defaultVal, content.validators)
    });

    const onChange = e => {
        const newVal = typeof e === "string" | typeof e === "number"
            ? e
            : e.target.value;
        setCapturedValue({
            value: newVal, ...combineAndValidate(newVal, content.validators)
        });
    };

    const modifiedProps = {
        type: content.type,
        name: content.name,
        placeholder: content.placeholder,
        className: "custom-form-control",
        value: capturedValue.value,
        isValid: capturedValue.valid,
        isInvalid: capturedValue.invalid,
        onChange: onChange
    };

    switch(content.type) {
    case "select":
        return <Form.Select {...modifiedProps}>
            <option disabled value={content.defaultValue}>{content.placeholder}</option>
            {content.options.map(({ label, value }) => <option key={value} value={value}>{label}</option>)}
        </Form.Select>;

    case "textarea":
        return <FilteredTextArea {...modifiedProps}/>;

    case "likert":
        return <CustomizedLikert {...modifiedProps}/>;
    case "text":
    default:
        return <Form.Control {...modifiedProps}/>;
    }
}

function GeneratedCards() {
    return <>
        {cards.map(card => <CardSection key={card.title} content={card}/>)}
    </>

    ;
}

export default function WriteReview() {
    const { id } = useParams();
    const userObj = useUserObj();
    const capturedProviderValue = useCapturedProviderValue();
    const { values } = capturedProviderValue;
    const [professorObj, setProfessorObj] = useState(null);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_URL}/courses/get/${id}`, { method: "GET" })
            .then(res => res.json())
            .then(setProfessorObj);
    }, [id]);

    const submitReview = async () => {
        const reviewObj = {
            course_id: id,
            course_name: professorObj.course_id,
            user_id: userObj.user._id,
            prof_name: professorObj.instructor,

            quarter: values["quarter"].value,
            year: Number(values["year"].value),
            format: values["format"].value,
            grade: values["grade"].value,

            midterm: Number(values["midterm"].value),
            workload: Number(values["workload"].value),
            lecture: Number(values["lecture"].value),
            written: values["written"].value,
        };

        console.log({reviewObj});
        console.log("Sending request to", `${process.env.REACT_APP_SERVER_URL}/review/add`);
        try {
            const postResp = await axios.post(`${process.env.REACT_APP_SERVER_URL}/review/add`, reviewObj);
            console.log("Post response", postResp);
            const review_id = postResp.data.id;
            if (!review_id) {
                throw new Error("Review ID not found");
            }

            const updateResp = await axios.put(`${process.env.REACT_APP_SERVER_URL}/courses/update/${id}`,
                { review_id});

            if(postResp.status === 200 && updateResp.status === 200) {
                window.location = `/review/${id}`;
            }
        } catch (e) {
            console.log(e);
        }
    };

    let formCompleted = true;
    const verticalProgressData = cards.map(card => {
        let started = false;
        let mainPointComplete = true;
        const subpoints = card.inputSets.map(inputSet => {
            const subpointComplete = inputSet.inputs.reduce((acc, input) => {
                if(values[input.name]?.valid) {
                    started = true;
                    return acc;
                }
                mainPointComplete = false;
                return false;
            }, true);

            return {
                title: inputSet.title, complete: subpointComplete
            };
        });

        formCompleted = formCompleted && mainPointComplete;
        return {
            title: card.title, complete: mainPointComplete, started: started, subpoints: subpoints
        };
    });

    return <ImmediateCapturedProvider value={capturedProviderValue}>
        <div className="create-review">
            <div className="vertical-progress-wrapper">
                <VerticalProgress data={verticalProgressData}/>
            </div>
            <Form
                className="create-review-main"
                onSubmit={e => e.preventDefault()}
            >
                <div>
                    <GeneratedCards/>
                </div>
                <div className="submit-create-review-div">
                    {formCompleted && <button className="submit-create-review" onClick={submitReview}>Submit</button>}
                </div>
            </Form>
        </div>
    </ImmediateCapturedProvider>;
}