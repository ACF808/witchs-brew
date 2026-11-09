import { useEffect, useRef, useState } from "react";
import { ingredients } from "../data/recipes";

const ASSETS = "/assets";

export default function BrewingStation({
    selected,
    currentPotion,
    onSelectIngredient,
    onClear,
    onOpenSpellbook,
    onOpenBottle,
    customer,
    requestedPotion,
    coins,
}) {
    const sceneRef = useRef(null);
    const draggingRef = useRef(null);

    const [dragging, setDragging] = useState(null);
    const [overCauldron, setOverCauldron] = useState(false);
    const [tilt, setTilt] = useState(0);

    function getScenePosition(clientX, clientY) {
        const rect = sceneRef.current.getBoundingClientRect();

        return {
            x: ((clientX - rect.left) / rect.width) * 100,
            y: ((clientY - rect.top) / rect.height) * 100,
        };
    }

    function isOverCauldron(x, y) {
        return x >= 36 && x <= 70 && y >= 28 && y <= 45;
    }

    function startDrag(event, ingredient) {
        if (selected.length >= 2) return;

        event.preventDefault();

        const position = getScenePosition(event.clientX, event.clientY);

        draggingRef.current = {
            ingredient,
            ...position,
            tilt: 0,
            poured: false,
        };

        setDragging({ ingredient, ...position});
        setTilt(0);
        setOverCauldron(false);
    }

    useEffect(() => {
        function moveDrag(event) {
            if (!draggingRef.current || !sceneRef.current) return;

            const position = getScenePosition(event.clientX, event.clientY);

            draggingRef.current.x = position.x;
            draggingRef.current.y = position.y;

            setDragging({
                ingredient: draggingRef.current.ingredient,
                ...position,
            });

            setOverCauldron(isOverCauldron(position.x, position.y));
        }

        function scrollPour(event) {
            const drag = draggingRef.current;
            if(!drag) return;

            event.preventDefault();

            if (!isOverCauldron(drag.x, drag.y) || drag.poured) return;

            const nextTilt = Math.max(
                0,
                Math.min(110, drag.tilt + event.deltaY * 0.12)
            );

            drag.tilt = nextTilt;
            setTilt(nextTilt);

            if (nextTilt >= 85) {
                drag.poured = true;
                onSelectIngredient(drag.ingredient);
            }
        }

        function endDrag() {
            draggingRef.current = null;
            setDragging(null);
            setTilt(0);
            setOverCauldron(false);
        }

        window.addEventListener("pointermove", moveDrag);
        window.addEventListener("pointerup", endDrag);
        window.addEventListener("pointercancel", endDrag);
        window.addEventListener("wheel", scrollPour, { passive: false});

        return () => {
            window.removeEventListener("pointermove", moveDrag);
            window.removeEventListener("pointerup", endDrag);
            window.removeEventListener("pointercancel", endDrag);
            window.removeEventListener("wheel", scrollPour);
        };
    }, [onSelectIngredient]);

    return (
        <div className="brewing-scene" ref={sceneRef}>
            <img
                className="scene-background"
                src={`${ASSETS}/background.png`}
                alt=""
            />

            <img
                className="scene-layer"
                src={`${ASSETS}/ingredient-tray.png`}
                alt=""
            />

            <img
                className="scene-layer"
                src={`${ASSETS}/cauldron.png`}
                alt=""
            />

            <img
                className="scene-layer"
                src={`${ASSETS}/order-note.png`}
                alt=""
            />

            <div className="customer-order">
                {customer ? (
                    <>
                        <div className="order-heading">Potion Order</div>
                        <div className="order-customer">{customer.name}</div>
                        <div className="order-potion">{requestedPotion?.name}</div>
                        <div className="order-bottle">{customer.bottle} bottle</div>
                        <div className="order-reqard">{customer.reward} coins</div>
                    </>
                ) : (
                    <div className="order-heading">All orders complete!</div>
                )}
            </div>

            <div className="coin-counter">Coins: {coins}</div>
            
            <img
                className="scene-layer"
                src={`${ASSETS}/spellbook.png`}
                alt=""
            />

            <button
                className="scene-hotspot spellbook-hotspot"
                onClick={onOpenSpellbook}
                aria-label="Open spellbook"
            />

            <img
                className="scene-layer"
                src={`${ASSETS}/bottle.png`}
                alt=""
            />

            <button
                className="scene-hotspot bottle-hotspot"
                onClick={onOpenBottle}
                disabled={!currentPotion}
                aria-label="Bottle potion"
            />

            <div className="ingredient-row">
                {ingredients.map((ingredient) => (
                    <button
                        key={ingredient.id}
                        className="ingredient-button"
                        onPointerDown={(event) => startDrag(event, ingredient)}
                        disabled={selected.length >= 2}
                        title={ingredient.name}
                    >
                        <img
                            src={`${ASSETS}/ingredients/${ingredient.id}.png`}
                            alt={ingredient.name}
                            draggable={false}
                        />
                        <span>{ingredient.name}</span>
                    </button>
                ))}
            </div>

            {dragging && (
                <div
                    className="dragging-ingredient"
                    style={{
                        left: `${dragging.x}%`,
                        top: `${dragging.y}%`,
                        transform: `translate(-50%, -50%) rotate(${tilt}deg)`,
                    }}
                >
                    <img
                        src={`${ASSETS}/ingredients/${dragging.ingredient.id}.png`}
                        alt=""
                        draggable={false}
                    />
                </div>
            )}

            {overCauldron && dragging & (
                <div className="pour-hint">
                    {tilt >= 85 ? "poured!" : "scroll down to pour!"}
                </div>
            )}

            <div className="brewing-status">
                {currentPotion
                    ? `you brewed ${currentPotion.name}!`
                    : selected.length === 2
                    ? "That combo didn't work!"
                    : `Ingredients: ${selected.length}/2`}

                <button onClick={onClear}>Clear</button>
            </div>
        </div>
    );
}