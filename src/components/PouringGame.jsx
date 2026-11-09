import { useEffect, useRef, useState } from "react";

const ASSETS = "/assets/bottling";

export default function PouringGame({
    potion,
    bottleType,
    onComplete,
    onBack,
}) {
    const [fill, setFill] = useState(0);
    const [pouring, setPouring] = useState(false);
    const [finished, setFinished] = useState(false);

    const target = useRef(70);
    const fillRef = useRef(0);
    const finishedRef = useRef(false);

    
    useEffect(() => {
    if (!pouring || finished) return;

    const interval = setInterval(() => {
        setFill((previous) => {
        const next = Math.min(previous + 1, 100);
        fillRef.current = next;

        if (next >= 100) {
            setPouring(false);
            setFinished(true);
            finishedRef.current = true;
        }

        return next;
        });
    }, 25);

    return () => clearInterval(interval);
    }, [pouring, finished]);


    function stopPouring() {
        if (finishedRef.current || fillRef.current === 0) {
            setPouring(false);
            return;
        }

        finishedRef.current = true;
        setFinished(true);
        setPouring(false);
    }

    function getRating() {
        const difference = Math.abs(fill - target.current);

        if (difference <= 3) return "Perfect!";
        if (difference <= 8) return "Good!";
        if (difference <= 15) return "Not Bad!";
        return "Oops!";
    }

    function retry() {
        fillRef.current = 0;
        finishedRef.current = false;
        setFill(0);
        setFinished(false);
        setPouring(false);
    }

    const bottleImage = 
        bottleType === "tall" ? "bottle-tall.png" : "bottle-round.png";

    return (
        <div className="bottling-screen pouring-screen">
            <h1>Fill the Potion Bottle!</h1>
            <p>Hold to pour, then release near the dotted line!</p>

            <div className="pouring-area">
                <img
                    className={`pouring-ladle ${pouring ? "active" : ""}`}
                    src={`${ASSETS}/ladle.png`}
                    alt=""
                />

                <div
                    className={`pouring-bottle ${bottleType}`}
                >
                    <div className="liquid-container">
                        <div
                            className="potion-liquid"
                            style={{
                                height: `${fill}%`,
                                backgroundColor: potion.color,
                            }}
                        />
                        <div
                            className="target-line"
                            style={{ bottom: `${target.current}%`}}
                        />
                    </div>

                    <img
                        className="pouring-bottle-art"
                        src={`${ASSETS}/${bottleImage}`}
                        alt={`${bottleType} bottle`}
                    />
                </div>
            </div>

            {!finished ? (
                <button
                    className="pour-control"
                    onPointerDown={(event) => {
                        event.preventDefault();
                        event.currentTarget.setPointerCapture(event.pointerId);
                        setPouring(true);
                    }}
                    onPointerUp={stopPouring}
                    onPointerCancel={stopPouring}
                    onLostPointerCapture={stopPouring}
                >
                    {pouring ? "Pouring..." : "Hold to Pour"}
                </button>
            ) : (
                <div className="pour-result">
                    <h2>{getRating()}</h2>
                    <p>
                        Filled to {Math.round(fill)}% - target was {target.current}%!
                    </p>
                    <button onClick={retry}>Try Again</button>
                    <button onClick={() => onComplete(getRating())}>
                        Continue to Corking
                    </button>
                </div>
            )}

            <button className="bottling-back" onClick={onBack}>
                Back to Bottle Selection
            </button>
        </div>
    );
}