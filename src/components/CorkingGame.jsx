import { useEffect, useRef, useState } from "react";
import "./CorkingGame.css";

export default function CorkingGame({
    potion,
    bottleType,
    onComplete,
}) {
    const [position, setPosition] = useState(50);
    const [finished, setFinished] = useState(false);
    const [rating, setRating] = useState("");

    const positionRef = useRef(50);

    useEffect(() => {
        if (finished) return;

        let frame;
        let start;

        function animate(time) {
            if (start === undefined) start = time;

            const elapsed = (time - start) / 1000;
            const next = 50 + 35 * Math.sin(elapsed *3);

            positionRef.current = next;
            setPosition(next);

            frame = requestAnimationFrame(animate);
        }

        frame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(frame);
    }, [finished]);

    function dropCork() {
        if(finished) return;

        const difference = Math.abs(positionRef.current - 50);

        let result;

        if (difference <= 3) {
            result = "Perfect!";
        } else if (difference <=8) {
            result = "Good!";
        } else if (difference <=15) {
            result = "Not Bad!";
        } else {
            result = "Oops!"
        }

        setRating(result);
        setFinished(true);
    }

    function retry() {
        setPosition(50);
        positionRef.current = 50;
        setFinished(false);
        setRating("");
    }

    return (
        <div className="corking-screen">
            <h1>Seal your potion!</h1>
            <p>Drop the cork when it's lined up with the bottle!</p>

            <div className="corking-area">
                <div
                    className={`moving-cork ${finished ? "dropped" : ""}`}
                    style={{ left: `${position}%`}}
                >
                    <img
                        src="/assets/bottling/cork.png"
                        alt="Cork"
                    />
                </div>

                <div className="cork-target" />

                <div className={`corking-bottle ${bottleType}`}>
                    <div className="corking-liquid-container">
                        <div
                            className="corking-liquid"
                            style={{ backgroundColor: potion.color }}
                        />
                    </div>

                    <img
                        src={`/assets/bottling/bottle-${bottleType}.png`}
                        alt={`${bottleType} potion bottle`}
                    />
                </div>
            </div>

            {!finished ? (
                <button
                    className="cork-button"
                    onClick={dropCork}
                >
                    Drop Cork!
                </button>
            ) : (
                <div className="cork-result">
                    <h2>{rating}</h2>

                    <button onClick={retry}>
                        Try Again
                    </button>

                    <button onClick={() => onComplete(rating)}>
                        Serve Potion!
                    </button>
                </div>
            )}
        </div>
    );
}