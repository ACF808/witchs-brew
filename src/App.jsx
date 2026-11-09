import { useState } from "react";
import { ingredients, recipes } from "./data/recipes";
import BrewingStation from "./components/BrewingStation";
import "./App.css";

function App() {
  const [selected, setSelected] = useState([]);
  const [currentPotion, setCurrentPotion] = useState(null);
  const [discovered, setDiscovered] = useState([]);
  const [showSpellbook, setShowSpellbook] = useState(false);

  function selectIngredient(ingredient) {
    if (selected.length >= 2) return;

    const updated = [...selected, ingredient.id];
    setSelected(updated);

    if (updated.length === 2) {
      const recipe = recipes.find((recipe) =>
        recipe.ingredients.every((id) => updated.includes(id))
      );

      if (recipe) {
        setCurrentPotion(recipe);

        setDiscovered((previous) =>
          previous.includes(recipe.id)
            ? previous
            : [...previous, recipe.id]
        );
      } else {
        setCurrentPotion(null);
      }
    }
  }

  function resetCauldron() {
    setSelected([]);
    setCurrentPotion(null);
  }

  return (
    <main className="game">
      <BrewingStation
        selected={selected}
        currentPotion={currentPotion}
        onSelectIngredient={selectIngredient}
        onClear={resetCauldron}
        onOpenSpellbook={() => setShowSpellbook(true)}
        onOpenBottle={() => alert("Bottling coming next!")}
      />

      {showSpellbook && (
        <div
          className="modal-backdrop"
          onClick={() => setShowSpellbook(false)}
        >
          <div
            className="spellbook-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button onClick={() => setShowSpellbook(false)}>
              X
            </button>

            <h2>Spellbook</h2>
            <p>
              Discovered {discovered.length}/{recipes.length} potions
            </p>

            {recipes.map((recipe) => (
              <p key={recipe.id}>
                {discovered.includes(recipe.id)
                  ? recipe.name
                  : "???"}
              </p>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

export default App;