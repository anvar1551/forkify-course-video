import * as model from './model.js'
import {MODAL_CLOSE_SEC} from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// if (module.hot) {
//   module.hot.accept();
// };

const controllRecipes = async function() {
  try{
    const id = window.location.hash.slice(1);
    // console.log(id);

    if(!id) return;
    recipeView.renderSpiner();

    // 0) Update results view to mark selected search result 
    resultsView.update(model.getSearchResultPage());
   
    
    // 1) Loading recipe 
    await model.loadRecipe(id);
    // const {recipe} = model.state.recipe;

    // 2) Rendering recipe 
    recipeView.render(model.state.recipe); 

    // 3) Updating bookmarks 
     bookmarksView.update(model.state.bookmarks); 
   } catch(err) {
    recipeView.renderError();
  }
};


const controllSearchResults = async function() {
    try{
      resultsView.renderSpiner();

      // 1) Get search query 
      const query = searchView.getQuery();
      if(!query) return;

      // 2) Load search results
     await model.loadSearchResults(query);

     // 3) Render results
    
     resultsView.render(model.getSearchResultPage());

     //4 Render initial pagination buttons 
      paginationView.render(model.state.search);
    } catch(err) {
      console.log(err);
    }
    
};

// controllSearchResults();
const controllPagination = function(goToPage) {
     //3) Render new results
     resultsView.render(model.getSearchResultPage(goToPage));
     //4 Render NEW pagination buttons 
      paginationView.render(model.state.search);
};

const controllServings = function(newServings) {
  //Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view 
  //  recipeView.render(model.state.recipe); 
   recipeView.update(model.state.recipe); 
};

const controllAddBookmark = function() {
  // 1) Add or remove bookmarks
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
   else model.deleteBookmark(model.state.recipe.id);
  // 2) Update recipe view 
  recipeView.update(model.state.recipe);

  // 3) render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controllBookmarks = function() {
  bookmarksView.render(model.state.bookmarks)
};

const controllAddRecipe = async function(newRecipe) {
  try{
    // Show loading spinner 
    addRecipeView.renderSpiner();
  // Upload the new Recipe data
  await model.uploadRecipe(newRecipe);
  console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`)
    // Close form window
    setTimeout(function() {
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000);

  } catch(err) {
    console.error(err);
    addRecipeView.renderError(err.message)
  }
};

const newFeature = function() {
  console.log('Welcome to the application');
}

const init = function() {
  bookmarksView.addHandlerRender(controllBookmarks);
  recipeView.addHandlerRender(controllRecipes);
  recipeView.addHandlerUpdateServings(controllServings);
  recipeView.addHandlerAddBookmark(controllAddBookmark);
  searchView.addHandlerSearch(controllSearchResults);
  paginationView.addHandlerClick(controllPagination);
  addRecipeView.addHandlerUpload(controllAddRecipe);
 newFeature();
};

init();


