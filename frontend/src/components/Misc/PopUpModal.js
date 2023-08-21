// TODO: Unused component. Determine what to do with this
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import "../../css/popUpModal.css";

// I put one in Error404 page to see it
function PopUpModal(json) {
    // json must have "title" and "content"
    const title = json.json.title;
    const content = json.json.content;
    const [show, setShow] = useState(true);
    // show is set to true so that we don't need a button to display Modal
    const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);
    // OR, you can create a button onClick = handleShow to show it.
    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="color-grey">{content}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button className="buttonColor" onClick={handleClose}>
                    Continue
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default PopUpModal;