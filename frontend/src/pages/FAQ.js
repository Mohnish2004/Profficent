import { Accordion } from "react-bootstrap";
import "../css/faq.css";

function FAQ() {
    return (
        <Accordion defaultActiveKey="0" className="faqs">
            <Accordion.Item eventKey="0">
                <Accordion.Header>What is AggieReview?</Accordion.Header>
                <Accordion.Body>
                    AggieReview is a site made by CodeLab that allows you to review all courses you take at UC Davis in an objective and unbaised manner.
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
                <Accordion.Header>What makes AggieReview different from other websites?</Accordion.Header>
                <Accordion.Body>
                    Aggie Review is made by UC Davis students for the student community at UC Davis keeping in mind credibility and validitiy of the reviews which inturn better helps students pick classes which best suits their learning needs.
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
                <Accordion.Header>Is AggieReview anonymous ?</Accordion.Header>
                <Accordion.Body>
                    Aggie Review does not take any personal information and display it to the public. The information you provide when creating a profile is only is used to identify you as a UC Davis student so you can write reviews. Your profile is anonyomus.
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
                <Accordion.Header>Is CodeLab anonymous ?</Accordion.Header>
                <Accordion.Body>
                    CodeLab is an organization at UC Davis working to provide students with real-world experience in the software industry. CodeLab members develop their technical skills by working in interdisciplinary teams on projects over the course of one or more academic quarters.
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}

export default FAQ;