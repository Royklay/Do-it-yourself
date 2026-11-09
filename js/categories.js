// Get the search input
const searchInput = document.getElementById("searchInput");
// Get all category cards
const categoryCards = document.querySelectorAll(".category-card");
// Get the no results message
const noResults = document.getElementById("noResults");
// Get the clear button
const clearSearch = document.getElementById("clearSearch");
// Search Categories
searchInput.addEventListener("input", function() {
// Get what the user has typed
 const searchValue = searchInput.value.toLowerCase().trim();
  let foundCategories = 0;
  // Check every category card
    categoryCards.forEach(function(card) {
     // Get the category name and keywords
        const categoryName = card.dataset.category;
    // Check if the search matches
        if (categoryName.includes(searchValue)) {

            card.style.display = "block";
            foundCategories++;

        } else {

            card.style.display = "none";

        }

    });
