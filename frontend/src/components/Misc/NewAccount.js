// TODO: Unused page. Determine what to do with this. Originally intended to be an on-boarding page
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Progress from "./CustomProgressBar";
import "../../css/newAccount.css";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const FORM_PARTS = [
    {
        label: "Info",
        component: Info
    }, {
        label: "Major",
        component: Major
    }, {
        label: "Year",
        component: Year
    }, {
        label: "Club",
        component: Club
    }, {
        label: "Job",
        component: Job
    }, {
        label: "GPA",
        component: GPA
    }, {
        label: "",
        component: Complete
    }
];
const LABELS = ["", ...FORM_PARTS.map(part => part.label)];
const NUM_STEPS = FORM_PARTS.length;

function SyncedInput({ value, setValue, placeholder }) {
    const editValue = e => setValue(e.nativeEvent.target.value);
    return (
        <Form.Group className="mb-3">
            <Form.Control placeholder={placeholder} onChange={editValue} value={value}/>
        </Form.Group>
    );
}

function Info({ navigation, prefilled, appendData }) {
    const [first, setFirst] = useState(prefilled.name?.firstName || "");
    const [last, setLast] = useState(prefilled.name?.lastName || "");
    const parseAndAppend = () => {
        appendData({
            name: {
                firstName: first.trim(),
                lastName: last.trim()
            }
        });
    };

    return (
        <>
            <div className="new-account-creation-form-content">
                <h2 className="new-account-creation-form-label">Info</h2>
                <p>Statistics show that 90% of people do not read!</p>
                <SyncedInput placeholder="First Name" value={first} setValue={setFirst}/>
                <SyncedInput placeholder="Last Name" value={last} setValue={setLast}/>
            </div>
            <Controls navigation={navigation} beforeNavigate={parseAndAppend}/>
        </>
    );
}

function Major({ navigation, prefilled, appendData }) {
    const [major, setMajor] = useState(prefilled.majors?.join(", ") || "");
    const parseAndAppend = () => {
        appendData({
            majors: major.split(",").map(major => major.trim()),
            minors: [],
        });
    };

    return (
        <>
            <div className="new-account-creation-form-content">
                <h2 className="new-account-creation-form-label">Major</h2>
                <p>Is your major a REAL major???</p>
                <SyncedInput placeholder="Majors" value={major} setValue={setMajor}/>
            </div>
            <Controls navigation={navigation} beforeNavigate={parseAndAppend}/>
        </>
    );
}

function Year({ navigation, prefilled, appendData }) {
    const [year, setYear] = useState(prefilled.year?.toString() || "");
    const parseAndAppend = () => {
        appendData({
            year: year
        });
    };

    return (
        <>
            <div className="new-account-creation-form-content">
                <h2 className="new-account-creation-form-label">Year</h2>
                <p>Are you old or OLD old?</p>
                <SyncedInput placeholder="Expected Graduation Year" value={year} setValue={setYear}/>
            </div>
            <Controls navigation={navigation} beforeNavigate={parseAndAppend}/>
        </>
    );
}

function Club({ navigation, prefilled, appendData }) {
    const [clubs, setClubs] = useState(prefilled.clubs?.join(", ") || "");
    const parseAndAppend = () => {
        appendData({
            clubs: clubs.split(",").map(club => club.trim())
        });
    };

    return (
        <>
            <div className="new-account-creation-form-content">
                <h2 className="new-account-creation-form-label">Club</h2>
                <p>CodeLab?</p>
                <SyncedInput placeholder="Clubs" value={clubs} setValue={setClubs}/>
            </div>
            <Controls navigation={navigation} beforeNavigate={parseAndAppend}/>
        </>
    );
}

function Job({ navigation, prefilled, appendData }) {
    const [jobs, setJobs] = useState(prefilled.jobs?.join(", ") || "");
    const parseAndAppend = () => {
        appendData({
            jobs: jobs.split(",").map(job => job.trim())
        });
    };
    return (
        <>
            <div className="new-account-creation-form-content">
                <h2 className="new-account-creation-form-label">Job</h2>
                <p>Work or Full-time Student?</p>
                <SyncedInput placeholder="Clubs" value={jobs} setValue={setJobs}/>
            </div>
            <Controls navigation={navigation} beforeNavigate={parseAndAppend}/>
        </>
    );
}


function GPA({ navigation, prefilled, appendData }) {
    const [GPA, setGPA] = useState(prefilled.GPA || "");
    const parseAndAppend = () => {
        appendData({
            GPA: GPA
        });
    };

    return (
        <>
            <div className="new-account-creation-form-content">
                <h2 className="new-account-creation-form-label">GPA</h2>
                <p>Good Grades?</p>
                <SyncedInput placeholder="Expected Graduation Year" value={GPA} setValue={setGPA}/>
            </div>
            <Controls navigation={navigation} beforeNavigate={parseAndAppend}/>
        </>
    );
}

function Complete({ navigation, submit }) {
    return (
        <>
            <div className="new-account-creation-form-content">
                <h2 className="new-account-creation-form-label">YOU'RE DONE!!!</h2>
                <Button type="primary" onClick={submit}>Submit</Button>
            </div>
            <Controls navigation={navigation}/>
        </>
    );
}

// Step page properties navigation (next, previous), prefilled (all current form fields read-only), appendData, submit
// How to make a new page: navigation.previous and navigation.next are null/falsy when they should not exist (first/last page)
// Start with a React fragment <></>. Navigation functions will go to the next/previous page
// Prefilled is the current information already filled out/known. Do not modify it, it is read-only.
// To modify, use appendData to merge an object with prefilled
// The submit function will submit the form after appending finishes
// eslint-disable-next-line no-unused-vars
function LazyForm({ navigation, prefilled, appendData, submit }) {
    const unwrapSubmit = e => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const payload = {
            name: {
                firstName: "John",
                lastName: "Doe"
            },
            majors: formData.get(FORM_PARTS[1].label).split(",").map(major => major.trim()),
            minors: [],
            years: Number(formData.get(FORM_PARTS[2].label)) || -1,
            GPA: formData.get(FORM_PARTS[5].label),
            email: formData.get(FORM_PARTS[0].label),
            password: "supersecurepassword",
            clubs: formData.get(FORM_PARTS[3].label).split(",").map(club => club.trim()),
            jobs: formData.get(FORM_PARTS[4].label).split(",").map(job => job.trim())
        };
        appendData(payload);
        submit();
    };

    return (
        <>
            <div className="new-account-creation-form-content">
                <h2 className="new-account-creation-form-label">What are you studying</h2>
                <Form onSubmit={unwrapSubmit}>
                    {FORM_PARTS.map(parts =>
                        <Form.Group className="mb-3" key={parts.label}>
                            <Form.Control placeholder={parts.label} name={parts.label}/>
                        </Form.Group>
                    )}
                </Form>
            </div>
            <Controls navigation={navigation}/>
        </>
    );
}

function NewAccount() {
    const [newUser, setNewUser] = useState({});
    const [stepNum, setStepNum] = useState(0);
    const [submitted, setSubmit] = useState(false);
    useEffect(() => {
        if(!submitted) { return; }
        console.log("Submitting:");
        console.log(newUser);
        fetch(`${SERVER_URL}/user/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser)
        }).then(console.log);
    }, [submitted]);

    const ChosenElement = FORM_PARTS[stepNum].component;
    const appendData = newData => {
        setNewUser({
            ...newUser,
            ...newData
        });
    };

    return (
        <div className="new-account-creation">
            <Progress percentage={Math.ceil((stepNum + 1) / NUM_STEPS * 100)} labels={LABELS}/>
            <div className="new-account-creation-form-container">
                <ChosenElement
                    navigation={{
                        next: stepNum < NUM_STEPS - 1 ? () => setStepNum(stepNum + 1) : null,
                        previous: stepNum > 0 ? () => setStepNum(stepNum - 1) : null
                    }}
                    submit={() => setSubmit(true)}
                    appendData={appendData}
                    prefilled={newUser}
                />
            </div>
        </div>
    );
}

function Controls({ navigation, beforeNavigate }) {
    const before = beforeNavigate || (() => {
    });
    return (
        <div className="new-account-creation-controls">
            {navigation.previous ?
                <Button
                    className="new-account-creation-control-button"
                    variant="secondary"
                    onClick={() => {
                        before();
                        navigation.previous();
                    }}
                >
                    Previous
                </Button>
                : <div className="new-account-creation-control-button"/>}
            {navigation.next ?
                <Button
                    className="new-account-creation-control-button"
                    variant="secondary"
                    onClick={() => {
                        before();
                        navigation.next();
                    }}
                >
                    Next
                </Button>
                : <div className="new-account-creation-control-button"/>}
        </div>
    );
}

export default NewAccount;