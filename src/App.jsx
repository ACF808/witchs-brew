import { useState } from "react";
import { ingredients, recipes } from "./data/recipes";
import "./App.css";

function App() {
  const [selected, setSelected] = useState([]);
  const [currentPotion, setCurrentPotion] = useState(null);
  const [discovered, setDiscovered] = useState([]);

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
      <h1>Witch's Brew</h1>
      <p>Little potions, big problems.</p>

      <section className="cauldron">
        <h2>Brewing Station</h2>

        <div className="pot">
          {currentPotion ? "🧪" : "🍲"}
        </div>

        <p>
          {currentPotion
            ? `You brewed ${currentPotion.name}!`
            : selected.length === 2
            ? "That combination didn't work..."
            : "Choose two ingredients!"}
        </p>

        <div className="selected">
          {selected.map((id, index) => (
            <span key={index}>
              {ingredients.find((item) => item.id === id)?.name}
            </span>
          ))}
        </div>

        <button onClick={resetCauldron}>Clear Cauldron</button>
      </section>

      <section className="ingredients">
        <h2>Ingredients</h2>

        <div className="ingredient-list">
          {ingredients.map((ingredient) => (
            <button
              key={ingredient.id}
              onClick={() => selectIngredient(ingredient)}
              disabled={selected.length >= 2}
            >
              <span>{ingredient.emoji}</span>
              <p>{ingredient.name}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="spellbook">
        <h2>Spellbook</h2>
        <p>
          Discovered {discovered.length} / {recipes.length} potions
        </p>

        {recipes.map((recipe) => (
          <p key={recipe.id}>
            {discovered.includes(recipe.id)
              ? `✓ ${recipe.name}`
              : "???"}
          </p>
        ))}
      </section>
    </main>
  );
}

export default App;