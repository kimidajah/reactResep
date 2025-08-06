import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
    setRecipes(savedRecipes);
  }, []);

  const deleteRecipe = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus resep ini?')) {
      const updatedRecipes = recipes.filter(recipe => recipe.id !== id);
      localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
      setRecipes(updatedRecipes);
    }
  };

  const handleEdit = (recipe) => {
    navigate(`/edit/${recipe.id}`);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Daftar Resep Makanan Ringan</h2>
        <Link
          to="/"
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          + Tambah Resep Baru
        </Link>
      </div>

      <div style={{ display: 'grid', gap: '20px' }}>
        {recipes.map(recipe => (
          <div
            key={recipe.id}
            style={{
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h3 style={{ margin: '0 0 10px 0' }}>{recipe.name}</h3>
                <p style={{ color: '#666', margin: '0 0 15px 0' }}>
                  Waktu Persiapan: {recipe.prepTime}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleEdit(recipe)}
                  style={{
                    padding: '8px 15px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteRecipe(recipe.id)}
                  style={{
                    padding: '8px 15px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Hapus
                </button>
              </div>
            </div>
            
            <div style={{ marginTop: '15px' }}>
              <h4 style={{ margin: '0 0 10px 0' }}>Bahan-bahan:</h4>
              <p style={{ whiteSpace: 'pre-line', margin: '0 0 15px 0' }}>{recipe.ingredients}</p>
              
              <h4 style={{ margin: '0 0 10px 0' }}>Cara Pembuatan:</h4>
              <p style={{ whiteSpace: 'pre-line', margin: '0' }}>{recipe.instructions}</p>
            </div>
            
            <small style={{ display: 'block', marginTop: '15px', color: '#666' }}>
              Dibuat pada: {recipe.createdAt}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecipeList;
