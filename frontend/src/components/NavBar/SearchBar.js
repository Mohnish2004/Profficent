import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchIcon from "./SearchIcon";
import SubSearchBarAutofill from "./SubSearchBarAutofill";
import "../../css/navbar/navbar.css";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function SearchBar() {
    const [allClassData, setAllClassData] = useState({});
    const classNameArr = Object.keys(allClassData);

    const [className, setClassName] = useState("");
    const [profName, setProfName] = useState("");

    const [showProfessorNav, setShowProfessorNav] = useState(false); // Show search bar for professors
    const [errorMessage, setErrorMessage] = useState(""); // Error to show if not all fields are filled
    const filterClassData = className
        ? classNameArr
            .filter(value => value.toLowerCase().startsWith(className.toLowerCase()))
        : [];
    const filterProfData = profName
        ? allClassData[className]
            .filter(value => value.toLowerCase().includes(profName.toLowerCase()))
        : [];

    // Load in data for all classes and the array of class names like ARE145
    useEffect(() => {
        axios.get(`${SERVER_URL}/allClasses/get-all-classes`)
            .then(res => res.data)
            .then(allClasses => {
                const newAllClassData = {};
                allClasses
                    .forEach(classObj => {
                        const className = classObj.course_id;
                        const classInstructor = classObj.instructor;

                        const classInstructorArr = newAllClassData[className] = newAllClassData[className] || [];
                        if(!classInstructorArr.includes(classInstructor)) {
                            classInstructorArr.push(classInstructor);
                        }
                    });
                setAllClassData(newAllClassData);
            });
    }, []);

    const getReview = () => {
        axios.get(`${SERVER_URL}/allClasses/get-class-and-prof/${className}/${profName}`)
            .then(res => {
                if(res.data.length) {
                    const id = res.data[0]._id;
                    // console.log(id);
                    window.location.href = `/review/${id}`;
                    return;
                }
                setErrorMessage("Invalid Course or Professor!");
            }).catch(console.log);
    };

    function fetchReview() {
        if(!className) { setErrorMessage("Please enter a course before proceeding!"); } else if(!profName) { setErrorMessage("Please enter a professor before proceeding!"); } else {
            // console.log(`Class: ${className} with Prof. ${profName}`);
            getReview();
        }
    }

    return (
        <div className="search-bar">
            <SubSearchBarAutofill
                placeholder="Course Name"
                onChange={e => setClassName(e.target.value)}
                onClear={() => {
                    setClassName("");
                    setProfName("");
                    setShowProfessorNav(false);
                }}
                onListItemClick={course => {
                    setClassName(course);
                    setShowProfessorNav(true);
                }}
                choices={filterClassData}
            />
            {showProfessorNav &&
                <SubSearchBarAutofill
                    placeholder="Professor Name"
                    choices={filterProfData}
                    onChange={e => setProfName(e.target.value)}
                    onClear={() => {
                        setProfName("");
                    }}
                    onListItemClick={review => {
                        setProfName(review);
                    }}
                />
            }
            <SearchIcon onClick={fetchReview}/>
            {errorMessage && <p className="errorMessage">{errorMessage}</p>}
        </div>
    );
}

export default SearchBar;