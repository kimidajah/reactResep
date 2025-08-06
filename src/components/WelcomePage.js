import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const recipesQuery = query(collection(db, 'resep'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(recipesQuery);
        const recipesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log('Fetched recipes:', recipesData);
        setRecipes(recipesData);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        alert('Gagal mengambil data resep');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const deleteRecipe = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus resep ini?')) {
      try {
        await deleteDoc(doc(db, 'resep', id));
        setRecipes(recipes.filter(recipe => recipe.id !== id));
        console.log('Recipe deleted successfully');
      } catch (error) {
        console.error('Error deleting recipe:', error);
        alert('Gagal menghapus resep: ' + error.message);
      }
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Memuat resep...
      </div>
    );
  }

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
              position: 'relative',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
              const imageDiv = e.currentTarget.querySelector('.recipe-image');
              if (imageDiv) {
                imageDiv.style.transform = 'scale(1.1)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              const imageDiv = e.currentTarget.querySelector('.recipe-image');
              if (imageDiv) {
                imageDiv.style.transform = 'scale(1.0)';
              }
            }}
          >
            <div 
              className="recipe-image"
              style={{
                width: '100%',
                height: '200px',
                backgroundImage: `url(${recipe.imageUrl || 'https://via.placeholder.com/400x200?text=Tidak+Ada+Gambar'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'transform 0.3s ease-in-out'
              }}
            />
            <div style={{ padding: '20px' }}>
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecipeList;
