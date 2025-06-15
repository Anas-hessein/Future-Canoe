
            // Recipe data storage (in-memory for now)
            let recipes = [];
            let currentDarkMode = false;

            // DOM elements
            const themeSwitch = document.getElementById('theme-switch');
            const openModalBtn = document.getElementById('openModal');
            const closeModalBtn = document.getElementById('closeModal');
            const cancelBtn = document.getElementById('cancelBtn');
            const modal = document.getElementById('addRecipeModal');
            const recipeForm = document.getElementById('recipeForm');
            const recipesContainer = document.getElementById('recipesContainer');
            const searchInput = document.getElementById('searchInput');
            const addIngredientBtn = document.getElementById('addIngredient');
            const ingredientsList = document.getElementById('ingredientsList');



            // Modal functionality
            const openModal = () => {
                modal.classList.add('open');
            };

            const closeModal = () => {
                modal.classList.remove('open');
                recipeForm.reset();
                resetIngredientsList();
            };

            openModalBtn.addEventListener('click', openModal);
            closeModalBtn.addEventListener('click', closeModal);
            cancelBtn.addEventListener('click', closeModal);

            // Close modal when clicking outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });

            // Ingredients management
            const resetIngredientsList = () => {
                ingredientsList.innerHTML = `
                    <div class="ingredient-item">
                        <input type="text" placeholder="Ingredient name" class="ingredient-name" required>
                        <input type="text" placeholder="Amount (e.g., 1 cup)" class="ingredient-amount" required>
                        <button type="button" class="btn btn-danger btn-small remove-ingredient">Remove</button>
                    </div>
                `;
                attachIngredientEvents();
            };

            const attachIngredientEvents = () => {
                const removeButtons = document.querySelectorAll('.remove-ingredient');
                removeButtons.forEach(button => {
                    button.addEventListener('click', (e) => {
                        if (ingredientsList.children.length > 1) {
                            e.target.closest('.ingredient-item').remove();
                        }
                    });
                });
            };

            addIngredientBtn.addEventListener('click', () => {
                const newIngredient = document.createElement('div');
                newIngredient.className = 'ingredient-item';
                newIngredient.innerHTML = `
                    <input type="text" placeholder="Ingredient name" class="ingredient-name" required>
                    <input type="text" placeholder="Amount (e.g., 1 cup)" class="ingredient-amount" required>
                    <button type="button" class="btn btn-danger btn-small remove-ingredient">Remove</button>
                `;
                ingredientsList.appendChild(newIngredient);
                attachIngredientEvents();
            });

            // Initialize ingredient events
            attachIngredientEvents();

            // Recipe form submission
            recipeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const formData = new FormData(recipeForm);
                const ingredients = [];
                
                // Collect ingredients
                const ingredientNames = document.querySelectorAll('.ingredient-name');
                const ingredientAmounts = document.querySelectorAll('.ingredient-amount');
                
                for (let i = 0; i < ingredientNames.length; i++) {
                    if (ingredientNames[i].value.trim() && ingredientAmounts[i].value.trim()) {
                        ingredients.push({
                            name: ingredientNames[i].value.trim(),
                            amount: ingredientAmounts[i].value.trim()
                        });
                    }
                }

                const recipe = {
                    id: Date.now(),
                    name: formData.get('recipeName'),
                    cuisine: formData.get('cuisine'),
                    prepTime: parseInt(formData.get('prepTime')),
                    cookTime: parseInt(formData.get('cookTime')),
                    totalTime: parseInt(formData.get('prepTime')) + parseInt(formData.get('cookTime')),
                    difficulty: formData.get('difficulty'),
                    ingredients: ingredients,
                    instructions: formData.get('instructions'),
                    createdAt: new Date()
                };

                recipes.push(recipe);
                renderRecipes();
                closeModal();
            });

            // Render recipes
                // Render recipes (REPLACE the existing renderRecipes function)
                const renderRecipes = (recipesToRender = recipes) => {
                    if (recipesToRender.length === 0) {
                        recipesContainer.innerHTML = `
                            <div class="empty-state">
                                <h3>No recipes found!</h3>
                                <p>Add your first recipe to get started on your cooking journey.</p>
                            </div>
                        `;
                        return;
                    }

                    recipesContainer.innerHTML = `
                        <div class="recipes-grid">
                            ${recipesToRender.map(recipe => `
                                <div class="recipe-card" data-id="${recipe.id}" onclick="openRecipeView(${recipe.id})">
                                    <h3>${recipe.name}</h3>
                                    <div class="recipe-meta">
                                        <span>⏱️ ${recipe.totalTime} min</span>
                                        <span>👨‍🍳 ${recipe.difficulty}</span>
                                        <span>🍽️ ${recipe.cuisine}</span>
                                    </div>
                                    <div class="ingredients-preview">
                                        <strong>Ingredients:</strong> ${recipe.ingredients.slice(0, 3).map(ing => ing.name).join(', ')}${recipe.ingredients.length > 3 ? '...' : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `;
                };
                                // Interactive Recipe View functionality
                let currentRecipe = null;
                let currentStep = 0;
                let recipeSteps = [];

                const openRecipeView = (recipeId) => {
                    currentRecipe = recipes.find(r => r.id === recipeId);
                    if (!currentRecipe) return;
                    
                    // Parse instructions into steps
                    recipeSteps = currentRecipe.instructions
                        .split('\n')
                        .filter(step => step.trim())
                        .map(step => step.trim());
                    
                    currentStep = 0;
                    showRecipeModal();
                };

                const showRecipeModal = () => {
                    const modal = document.createElement('div');
                    modal.className = 'modal recipe-view-modal open';
                    modal.id = 'recipeViewModal';
                    
                    modal.innerHTML = `
                        <div class="modal-inner">
                            <div class="recipe-header">
                                <button class="close-btn" id="closeRecipeView">&times;</button>
                                <h2>${currentRecipe.name}</h2>
                                <div class="recipe-meta-detailed">
                                    <span>⏱️ ${currentRecipe.totalTime} min</span>
                                    <span>👨‍🍳 ${currentRecipe.difficulty}</span>
                                    <span>🍽️ ${currentRecipe.cuisine}</span>
                                </div>
                            </div>
                            
                            <div class="recipe-content">
                                <div class="ingredients-section">
                                    <h4>Ingredients</h4>
                                    <div class="ingredients-list-view">
                                        ${currentRecipe.ingredients.map(ing => `
                                            <div class="ingredient-item-view">
                                                <span>${ing.name}</span>
                                                <span>${ing.amount}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                                
                                <div class="step-container">
                                    <div class="step-header">
                                        <h3>Instructions</h3>
                                        <div class="step-counter">Step ${currentStep + 1} of ${recipeSteps.length}</div>
                                    </div>
                                    
                                    <div class="step-content">
                                        <div class="step-text" id="currentStepText">
                                            ${recipeSteps[currentStep] || 'No instructions available'}
                                        </div>
                                    </div>
                                    
                                    <div class="progress-bar">
                                        <div class="progress-fill" id="progressFill"></div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="recipe-navigation">
                                <button class="btn" id="prevStep" ${currentStep === 0 ? 'disabled' : ''}>
                                    ← Previous
                                </button>
                                <div class="nav-buttons">
                                    ${currentStep === recipeSteps.length - 1 ? 
                                        '<button class="btn btn-primary" id="completeRecipe">Complete! 🎉</button>' :
                                        '<button class="btn btn-primary" id="nextStep">Next →</button>'
                                    }
                                </div>
                            </div>
                        </div>
                    `;
                    
                    document.body.appendChild(modal);
                    updateProgress();
                    attachRecipeViewEvents();
                };

                const updateProgress = () => {
                    const progressFill = document.getElementById('progressFill');
                    const progress = ((currentStep + 1) / recipeSteps.length) * 100;
                    if (progressFill) {
                        progressFill.style.width = `${progress}%`;
                    }
                };

                const updateStepContent = () => {
                    const stepText = document.getElementById('currentStepText');
                    const stepCounter = document.querySelector('.step-counter');
                    const prevBtn = document.getElementById('prevStep');
                    const nextBtn = document.getElementById('nextStep');
                    const completeBtn = document.getElementById('completeRecipe');
                    const navButtons = document.querySelector('.nav-buttons');
                    
                    if (stepText) stepText.textContent = recipeSteps[currentStep] || 'No instructions available';
                    if (stepCounter) stepCounter.textContent = `Step ${currentStep + 1} of ${recipeSteps.length}`;
                    
                    if (prevBtn) prevBtn.disabled = currentStep === 0;
                    
                    // Update navigation buttons
                    if (currentStep === recipeSteps.length - 1) {
                        navButtons.innerHTML = '<button class="btn btn-primary" id="completeRecipe">Complete! 🎉</button>';
                        document.getElementById('completeRecipe').addEventListener('click', () => {
                            alert('Congratulations! You completed the recipe! 🎉');
                            closeRecipeView();
                        });
                    } else {
                        navButtons.innerHTML = '<button class="btn btn-primary" id="nextStep">Next →</button>';
                        document.getElementById('nextStep').addEventListener('click', nextStep);
                    }
                    
                    updateProgress();
                };

                const nextStep = () => {
                    if (currentStep < recipeSteps.length - 1) {
                        currentStep++;
                        updateStepContent();
                    }
                };

                const prevStep = () => {
                    if (currentStep > 0) {
                        currentStep--;
                        updateStepContent();
                    }
                };

                const closeRecipeView = () => {
                    const modal = document.getElementById('recipeViewModal');
                    if (modal) {
                        modal.remove();
                    }
                };

                const attachRecipeViewEvents = () => {
                    document.getElementById('closeRecipeView').addEventListener('click', closeRecipeView);
                    
                    const nextBtn = document.getElementById('nextStep');
                    const prevBtn = document.getElementById('prevStep');
                    const completeBtn = document.getElementById('completeRecipe');
                    
                    if (nextBtn) nextBtn.addEventListener('click', nextStep);
                    if (prevBtn) prevBtn.addEventListener('click', prevStep);
                    if (completeBtn) {
                        completeBtn.addEventListener('click', () => {
                            alert('Congratulations! You completed the recipe! 🎉');
                            closeRecipeView();
                        });
                    }
                    
                    // Close modal when clicking outside
                    document.getElementById('recipeViewModal').addEventListener('click', (e) => {
                        if (e.target.id === 'recipeViewModal') {
                            closeRecipeView();
                        }
                    });
                };
        

            // Search functionality
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const filteredRecipes = recipes.filter(recipe => 
                    recipe.name.toLowerCase().includes(searchTerm) ||
                    recipe.cuisine.toLowerCase().includes(searchTerm) ||
                    recipe.ingredients.some(ing => ing.name.toLowerCase().includes(searchTerm))
                );
                renderRecipes(filteredRecipes);
            });

            // Initialize the app
            renderRecipes();

            // Make openRecipeView globally accessible
window.openRecipeView = openRecipeView;