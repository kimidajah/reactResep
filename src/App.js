import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CreateRecipe from './components/CreateRecipe';
import RecipeListView from './components/RecipeListView';
import EditRecipe from './components/EditRecipe';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/recipes" />} />
        <Route path="/create" element={<CreateRecipe />} />
        <Route path="/recipes" element={<RecipeListView />} />
        <Route path="/edit/:id" element={<EditRecipe />} />
        <Route path="*" element={<Navigate to="/recipes" />} />
      </Routes>
    </Router>
  );
}

export default App;
