import "../../css/floatingCard.css";

export default function FloatingCard({ title, description, imageSrc, onClick, spinner }) {
    return (
        <div className="blurCard">
            <h1>{title}</h1>
            {description && <p>{description}</p>}
            {imageSrc &&
                <div className="blurCardImage">
                    <img src={imageSrc} alt="Lock Icon"/>
                </div>
            }
            {spinner && <div className="forceAuthSpinner"/>}
            {onClick &&
                <div className="blurButton" onClick={onClick} tabIndex="0">
                    Click Me to Log In Again!
                </div>
            }
        </div>
    );
}