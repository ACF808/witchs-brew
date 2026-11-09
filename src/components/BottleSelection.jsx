const ASSETS = "/assets/bottling";

export default function BottleSelection({
    customer,
    potion,
    onSelect,
    onBack,
}) {
    return (
        <div className="bottling-screen">
            <h1>Choose your bottle!</h1>
            <p>
                {customer.name} requested a {customer.bottle} bottle.
            </p>

            <div className="bottle-choices">
                <button
                    className="bottle-choice"
                    onClick={() => onSelect("round")}
                >
                    <div className="bottle-preview">    
                        <img src={`${ASSETS}/bottle-round.png`} alt="Round bottle" />
                    </div>
                    <span>Round Bottle</span>
                </button>

                <button
                    className="bottle-choice"
                    onClick={() => onSelect("tall")}
                >
                    <div className="bottle-preview">    
                        <img src={`${ASSETS}/bottle-tall.png`} alt="Tall bottle" />
                    </div>
                    <span>Tall Bottle</span>
                </button>
            </div>

            <p className="bottling">
                Brewing: {potion.name}
            </p>

            <button className="bottling-back" onClick={onBack}>
                Back to Brewing
            </button>
        </div>
    );
}