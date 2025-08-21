import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import CreateRecipe from './components/CreateRecipe';
import RecipeListView from './components/RecipeListView';
import EditRecipe from './components/EditRecipe';
import Footer from './components/Footer';
import ChatButton from './components/ChatButton';

const AppContent = () => {
  const location = useLocation();
  const showFooter = location.pathname !== '/create';

  return (
    <div style={{ paddingBottom: showFooter ? '100px' : '0' }}>
      <Routes>
        <Route path="/" element={<Navigate to="/recipes" />} />
        <Route path="/create" element={<CreateRecipe />} />
        <Route path="/recipes" element={<RecipeListView />} />
        <Route path="/edit/:id" element={<EditRecipe />} />
        <Route path="*" element={<Navigate to="/recipes" />} />
      </Routes>
      {showFooter && <Footer />}
      <ChatButton />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
