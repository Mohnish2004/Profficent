import React, { useState } from "react";
import { Col } from "react-bootstrap";
import "../../css/accountPage.css";
import "../../css/savedCourses.css";
import "../../css/yourReviews.css";
import useUserObj from "../../utils/useUserObj";
import alert from "../../images/icons/alert.svg";
import axios from "axios";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
export default function ProfileEditableSection({ show, editMode, setEditMode }) {
    const { user } = useUserObj();

    // TODO: Fill default state with the user's data
    const [majors, setMajors] = useState("");
    const [minors, setMinors] = useState("");
    const [clubs, setClubs] = useState("");
    const [gpa, setGpa] = useState("");
    const [jobs, setJobs] = useState("");
    const [year, setYear] = useState("");

    // TODO: Better error checks and do not show errors before blur
    const majorError = editMode && !(majors.length || user.majors.length);
    const minorError = editMode && !(minors.length || user.minors.length);
    const clubError = editMode && !(clubs.length || user.clubs.length);
    const jobError = editMode && !(jobs.length || user.jobs.length);
    const yearError = editMode && !(year.length || user.years);

    const clearFields = () => {
        setMajors("");
        setMinors("");
        setClubs("");
        setGpa("");
        setJobs("");
        setYear("");
    };

    const handleCancel = () => {
        clearFields();
        setEditMode(false);
    };

    // TODO: Complete function
    const handleSave = () => {
        if(!(majorError || minorError || clubError || jobError || yearError)) {
            const url = `${SERVER_URL}/user/update/${user._id}`;
            const data = {
                email: user.email,
                majors: majors.length === 0 ? user.majors : [majors],
                minors: minors.length === 0 ? user.minors : [minors],
                clubs: clubs.length === 0 ? user.clubs : [clubs],
                years: year.length === 0 ? user.years : year,
                jobs: jobs.length === 0 ? user.jobs : [jobs],
                GPA: gpa.length === 0 ? user.GPA : gpa,
            };

            axios.put(url, data).then(() => {
                clearFields();
                setEditMode(false);
            });
        }
    };

    return (
        <>
            {show &&
                <Col>
                    <div className="ProfileContainer"> {/* starting of container */}
                        <div className={`EditSection ${editMode ? "EditSection-active" : "EditSection"}`}>
                            <button className="editProfile" onClick={() => setEditMode(!editMode)}></button>
                        </div>

                        <div className="EmailContainer">
                            <div className="subContainer">
                                <p className="Title">Email</p>
                                <p className="subTitle">You are only allowed to use your school email</p>
                            </div>
                            <div>
                                <input
                                    className="inputField"
                                    type="text"
                                    placeholder={user.email}
                                    readOnly
                                />
                            </div>
                        </div>

                        <hr className="lineBreak"></hr>

                        <div className="MajorContainer">
                            <div className="subContainer">
                                <p className="Title">Major(s)</p> {/* dropdown potentially for now user input */}
                            </div>
                            <div>
                                <input
                                    className={`inputField ${majorError ? "inputField-error" : editMode ? "inputField-active" : ""}`}
                                    name="majorinput"
                                    type="text"
                                    placeholder={user.majors.length === 0 ? "Major(s)" : user.majors.join(", ")}
                                    readOnly={!editMode}
                                    onChange={e => setMajors(e.target.value)}
                                    value={majors}
                                />
                                <img src={alert} alt="alert" className={`alert-img ${majorError ? "alert-img-active" : "alert-img"}`}/>
                                <label className={`majorlabel-inactive ${majorError ? "majorlabel-active" : "majorlabel-inactive"}`}>Major is required</label>
                            </div>
                        </div>

                        <div className="MinorContainer">
                            <div className="subContainer">
                                <p className="Title">Minor(s)</p> {/* dropdown potentially for now user input */}
                            </div>
                            <div>
                                <input
                                    className={`inputField ${editMode ? "inputField-active" : "inputField"}`}
                                    type="text"
                                    placeholder={!user.minors.length ? "Minor(s)" : user.minors.join(", ")}
                                    readOnly={!editMode}
                                    onChange={e => setMinors(e.target.value)}
                                    value={minors}
                                />
                            </div>
                        </div>

                        <hr className="lineBreak"></hr>
                        <div className="ExtraCurricularContainer">
                            <div className="subContainer">
                                <p className="Title">Extracurricular activities</p>
                                <p className="subTitle">Select Yes if you are affiliated with organizations or clubs on or off campus</p>
                            </div>
                            <div>
                                {
                                    editMode ?
                                        <div>
                                            <select
                                                className={`selectField ${clubError ? "selectField-error" : "selectField-active"}`}
                                                onChange={e => setClubs(e.target.value)}
                                                disabled={!editMode}
                                                defaultValue=""
                                            >
                                                <option value="" disabled>--select--</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                            <img src={alert} alt="alert" className={`alert-img ${clubError ? "alert-img-active" : "alert-img"}`}/>
                                            <label className={`clublabel-inactive ${clubError ? "clublabel-active" : "clublabel-inactive"}`}>Extracurricular activities is required</label>
                                        </div>
                                        :
                                        <div className="selectField"><p className="option-text">{!user.clubs.length ? "--select--" : user.clubs.join(", ")}</p></div>

                                }
                            </div>
                        </div>
                        <hr className="lineBreak"></hr>
                        <div className="GraduationContainer">
                            <div className="subContainer">
                                <p className="Title">Graduation Date</p>
                                <p className="subTitle">Select expected graduation date</p>
                            </div>
                            <div>
                                <input
                                    className={`inputField ${yearError ? "inputField-error" : editMode ? "inputField-active" : ""}`}
                                    type="number"
                                    min={2000}
                                    max={3000}
                                    placeholder={user.years && user.years > 0 ? user.years : "Year"}
                                    readOnly={!editMode}
                                    onChange={e => setYear(e.target.value)}
                                    value={year}
                                />
                                <img src={alert} alt="alert" className={`alert-img ${yearError ? "alert-img-active" : "alert-img"}`}/>
                                <label className={`yearlabel-inactive ${yearError ? "yearlabel-active" : "yearlabel-inactive"}`}>Graduation Date is required</label>
                            </div>
                        </div>

                        <hr className="lineBreak"></hr>

                        <div className="EmploymentContainer">
                            <div className="subContainer">
                                <p className="Title">Employment</p>
                                <p className="subTitle">Select Yes if you work outside of class</p>
                            </div>
                            <div>
                                {
                                    editMode ?
                                        <div>
                                            <select
                                                className={`selectField ${jobError ? "selectField-error" : "selectField-active"}`}
                                                onChange={e => setJobs(e.target.value)}
                                                disabled={!editMode}
                                                defaultValue=""
                                            >
                                                <option value="" disabled>--select--</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                            <img src={alert} alt="Alert" className={`alert-img ${jobError ? "alert-img-active" : "alert-img"}`}/>
                                            <label className={`joblabel-inactive ${jobError ? "joblabel-active" : "joblabel-inactive"}`}>Employment is required</label>
                                        </div>
                                        :
                                        <div className="selectField"><p className="option-text">{!user.jobs.length ? "--select--" : user.jobs.join(", ")}</p></div>

                                }
                            </div>
                        </div>

                        <hr className="lineBreak"></hr>

                        <div className="GpaContainer">
                            <div className="subContainer">
                                <p className="Title">GPA</p>
                                <p className="subTitle">Sharing your GPA is optional</p>
                            </div>
                            <div>
                                <input
                                    className={`inputField ${editMode ? "inputField-active" : "inputField"}`}
                                    type="text"
                                    placeholder={!user.GPA ? "GPA" : user.GPA}
                                    readOnly={!editMode}
                                    onChange={e => setGpa(e.target.value)}
                                    value={gpa}
                                />
                            </div>
                        </div>
                    </div>
                </Col>
            }
            <div className={`bottomContainer ${editMode ? "bottomContainer-active" : "bottomContainer"}`}>
                <button className="CancelButton" onClick={handleCancel}>
                    Cancel
                </button>
                <button className="SaveButton" onClick={handleSave}>
                    Save
                </button>
            </div>
        </>
    );
}