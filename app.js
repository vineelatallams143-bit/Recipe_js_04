(function() {
  // --- Private Data ---
  const recipes = [
    {
      id: 1,
      title: "🍝 Classic Spaghetti Carbonara",
      time: 25,
      difficulty: "easy",
      description: "A creamy Italian pasta dish made with eggs, cheese, pancetta, and black pepper.",
      category: "pasta",
      ingredients: ["Spaghetti", "Eggs", "Pancetta", "Parmesan", "Black Pepper"],
      steps: ["Boil pasta", "Cook pancetta", "Mix eggs and cheese", "Combine all"]
    },
    {
      id: 2,
      title: "🍛 Chicken Tikka Masala",
      time: 45,
      difficulty: "medium",
      description: "Tender chicken pieces in a creamy, spiced tomato sauce.",
      category: "curry",
      ingredients: ["Chicken", "Yogurt", "Spices", "Tomatoes", "Cream"],
      steps: ["Marinate chicken", "Grill chicken", "Prepare sauce", "Combine chicken and sauce"]
    },
    {
      id: 3,
      title: "🥗 Greek Salad",
      time: 15,
      difficulty: "easy",
      description: "Fresh vegetables, feta cheese, and olives tossed in olive oil and herbs.",
      category: "salad",
      ingredients: ["Cucumber", "Tomatoes", "Feta", "Olives", "Olive Oil"],
      steps: ["Chop vegetables", "Mix with feta and olives", "Dress with olive oil"]
    }
    // ... add more recipes as needed
  ];

  const recipeContainer = document.querySelector('#recipe-container');
  const searchBar = document.querySelector('#search-bar');
  const recipeCounter = document.querySelector('#recipe-counter');

  let currentRecipes = [...recipes];
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // --- Private Functions ---
  const renderList = (items) => `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`;

  const createRecipeCard = (recipe) => {
    const isFavorite = favorites.includes(recipe.id);
    return `
      <div class="recipe-card" data-id="${recipe.id}">
        <h3>${recipe.title}</h3>
        <div class="recipe-meta">
          <span>⏱️ ${recipe.time} min</span>
          <span class="difficulty ${recipe.difficulty.trim()}">${recipe.difficulty.trim()}</span>
        </div>
        <p>${recipe.description}</p>
        <button class="toggle-btn" data-target="steps-${recipe.id}">Show Steps</button>
        <div id="steps-${recipe.id}" class="steps hidden">${renderList(recipe.steps)}</div>
        <button class="toggle-btn" data-target="ingredients-${recipe.id}">Show Ingredients</button>
        <div id="ingredients-${recipe.id}" class="ingredients hidden">${renderList(recipe.ingredients)}</div>
        <button class="favorite-btn ${isFavorite ? "active" : ""}" data-id="${recipe.id}">❤️</button>
      </div>
    `;
  };

  const renderRecipes = (recipesToRender) => {
    recipeContainer.innerHTML = recipesToRender.map(createRecipeCard).join('');
    attachToggleEvents();
    attachFavoriteEvents();
    updateCounter(recipesToRender.length);
  };

  const attachToggleEvents = () => {
    document.querySelectorAll(".toggle-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const targetEl = document.getElementById(btn.dataset.target);
        targetEl.classList.toggle("hidden");
        btn.textContent = targetEl.classList.contains("hidden")
          ? btn.textContent.replace("Hide", "Show")
          : btn.textContent.replace("Show", "Hide");
      });
    });
  };

  const attachFavoriteEvents = () => {
    document.querySelectorAll(".favorite-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.dataset.id);
        if (favorites.includes(id)) {
          favorites = favorites.filter(f => f !== id);
        } else {
          favorites.push(id);
        }
        localStorage.setItem("favorites", JSON.stringify(favorites));
        renderRecipes(currentRecipes);
      });
    });
  };

  const updateCounter = (count) => {
    recipeCounter.textContent = `Showing ${count} of ${recipes.length} recipes`;
  };

  // Filtering logic
  const filterRecipes = (filter) => {
    switch(filter) {
      case "easy":
      case "medium":
      case "hard":
        currentRecipes = recipes.filter(r => r.difficulty.trim() === filter);
        break;
      case "quick":
        currentRecipes = recipes.filter(r => r.time < 30);
        break;
      case "favorites":
        currentRecipes = recipes.filter(r => favorites.includes(r.id));
        break;
      default:
        currentRecipes = [...recipes];
    }
    renderRecipes(currentRecipes);
  };

  // Sorting logic
  const sortRecipes = (sortType) => {
    if (sortType === "name") {
      currentRecipes.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortType === "time") {
      currentRecipes.sort((a, b) => a.time - b.time);
    }
    renderRecipes(currentRecipes);
  };

  // Active state handler
  const setActiveButton = (group, button) => {
    document.querySelectorAll(`#controls .${group} button`)
      .forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
  };

  // Event listeners for filters
  document.querySelectorAll("#controls .filters button").forEach(button => {
    button.addEventListener("click", () => {
      filterRecipes(button.dataset.filter);
      setActiveButton("filters", button);
    });
  });

  // Event listeners for sorts
  document.querySelectorAll("#controls .sorts button").forEach(button => {
    button.addEventListener("click", () => {
      sortRecipes(button.dataset.sort);
      setActiveButton("sorts", button);
    });
  });

  // Search with debounce
  let searchTimeout;
  searchBar.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const query = searchBar.value.toLowerCase();
      currentRecipes = recipes.filter(r =>
        r.title.toLowerCase().includes(query) ||
        r.ingredients.some(i => i.toLowerCase().includes(query))
      );
      renderRecipes(currentRecipes);
    }, 300);
  });

  // --- Public API ---
  const App = {
    init: () => {
      renderRecipes(recipes);
    }
  };

  // Initialize
  App.init();

})();