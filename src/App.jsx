import { useEffect, useState } from "react";
import { ingredients, recipes } from "./data/recipes";
import BrewingStation from "./components/BrewingStation";
import { customers } from "./data/customers";
import "./App.css";

function App() {
  const [selected, setSelected] = useState([]);
  const [currentPotion, setCurrentPotion] = useState(null);
  const [discovered, setDiscovered] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("witchs-brew-discovered")) || [];
    } catch {
      return [];
    }
  });
  const [showSpellbook, setShowSpellbook] = useState(false);
  const [customerIndex, setCustomerIndex] = useState(() => {
    return Number(localStorage.getItem("witchs-brew-customer")) || 0;
  });
  const [coins, setCoins] = useState(() => {
    return Number(localStorage.getItem("witchs-brew-coins")) || 0;
  });
  const currentCustomer = customers[customerIndex] ?? null;
  const requestedPotion = currentCustomer
    ? recipes.find((recipe) => recipe.id === currentCustomer.potionId)
    : null;
  
  useEffect(() => {
    localStorage.setItem(
      "witchs-brew-discovered",
      JSON.stringify(discovered)
    );
  }, [discovered]);

  useEffect(() => {
    localStorage.setItem("witchs-brew-customer", String(customerIndex));
  }, [customerIndex]);

  useEffect(() => {
    localStorage.setItem("witchs-brew-coins", String(coins));
  }, [coins]);

  function servePotion() {
    if (!currentCustomer || !currentPotion) return;

    if (currentPotion.id !== currentCustomer.potionId) {
      alert("That's not the potion this customer ordered!");
      return;
    }

    setCoins((previous) => previous + currentCustomer.reward);
    setCustomerIndex((previous) => previous + 1);
    resetCauldron();
  }
  
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
        customer={currentCustomer}
        requestedPotion={requestedPotion}
        coins={coins}
        onOpenBottle={servePotion}
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