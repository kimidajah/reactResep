import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

function RecipeListView() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes();
  }, []);

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

  const handleEdit = (recipe) => {
    navigate(`/edit/${recipe.id}`);
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '40px',
          borderBottom: '2px solid #eee',
          paddingBottom: '20px'
        }}>
          <div>
            <h2 style={{ 
              fontSize: '2.5rem', 
              margin: '0',
              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '10px'
            }}>
              Resep Makanan Ringan
            </h2>
            <p style={{ 
              color: '#666', 
              margin: '0',
              fontSize: '1.1rem' 
            }}>
              Kumpulan resep makanan ringan yang lezat dan mudah dibuat
            </p>
          </div>
          <Link
            to="/create"
            style={{
              padding: '12px 25px',
              background: 'linear-gradient(45deg, #4CAF50, #45a049)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '25px',
              fontSize: '1.1rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              ':hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)'
              }
            }}
          >
            <span style={{ fontSize: '1.5rem', marginRight: '5px' }}>+</span>
            Tambah Resep Baru
          </Link>
        </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '25px',
        padding: '20px 0'
      }}>
        {recipes.map(recipe => (
          <div
            key={recipe.id}
            onClick={() => setSelectedRecipe(recipe)}
            style={{
              position: 'relative',
              height: '250px',
              borderRadius: '15px',
              overflow: 'hidden',
              cursor: 'pointer',
              boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              ':hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 15px 30px rgba(0,0,0,0.2)'
              }
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${recipe.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'transform 0.3s ease',
                ':hover': {
                  transform: 'scale(1.1)'
                }
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7))',
                }}
              />
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '20px',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                color: 'white'
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{recipe.name}</h3>
            </div>
          </div>
        ))}
      </div>

      {selectedRecipe && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(5px)',
            padding: '20px'
          }}
          onClick={() => setSelectedRecipe(null)}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '0',
              borderRadius: '15px',
              maxWidth: '800px',
              width: '95%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
              overflow: 'hidden' // Penting untuk mengontrol scroll
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedRecipe(null)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                cursor: 'pointer',
                zIndex: 1000,
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }}
            >
              ×
            </button>

            <div style={{
              position: 'relative',
              width: '100%',
              height: '250px',
              flexShrink: 0,
              overflow: 'hidden'
            }}>
              <img
                src={selectedRecipe.imageUrl || 'https://via.placeholder.com/800x400?text=No+Image'}
                alt={selectedRecipe.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                padding: '20px',
                color: 'white'
              }}>
                <h1 style={{ margin: '0', fontSize: '2rem' }}>{selectedRecipe.name}</h1>
                <p style={{ margin: '5px 0 0', opacity: 0.8 }}>Waktu Persiapan: {selectedRecipe.prepTime}</p>
              </div>
            </div>
            
            <div style={{ 
              padding: '30px',
              overflowY: 'auto',
              maxHeight: 'calc(90vh - 250px)', // 250px adalah tinggi gambar header
              flex: 1
            }}>
              <div style={{ 
                display: 'grid', 
                gap: '30px',
                paddingRight: '5px' // Space untuk scrollbar
              }}>
              <div style={{ 
                background: '#f8f9fa',
                padding: '25px',
                borderRadius: '12px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <h3 style={{ 
                  margin: '0 0 15px 0',
                  color: '#2c3e50',
                  fontSize: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontWeight: '600'
                }}>
                  <span style={{ 
                    color: '#e67e22',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '0.8em'
                  }}>●</span>
                  Bahan-bahan
                </h3>
                <p style={{ 
                  whiteSpace: 'pre-line',
                  margin: '0',
                  lineHeight: '1.6',
                  color: '#34495e'
                }}>{selectedRecipe.ingredients}</p>
              </div>

              <div style={{ 
                background: '#f8f9fa',
                padding: '25px',
                borderRadius: '12px'
              }}>
                <h3 style={{ 
                  margin: '0 0 15px 0',
                  color: '#2c3e50',
                  fontSize: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span style={{ color: '#27ae60' }}>●</span>
                  Cara Pembuatan
                </h3>
                <p style={{ 
                  whiteSpace: 'pre-line',
                  margin: '0',
                  lineHeight: '1.6',
                  color: '#34495e'
                }}>{selectedRecipe.instructions}</p>
              </div>

              <div style={{ 
                display: 'flex',
                gap: '10px',
                justifyContent: 'flex-end',
                borderTop: '1px solid #eee',
                paddingTop: '20px',
                marginTop: '10px'
              }}>
              <button
                onClick={() => handleEdit(selectedRecipe)}
                style={{
                  padding: '12px 25px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>✏️</span>
                Edit Resep
              </button>
              <button
                onClick={() => {
                  deleteRecipe(selectedRecipe.id);
                  setSelectedRecipe(null);
                }}
                style={{
                  padding: '12px 25px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>🗑️</span>
                Hapus Resep
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}
</div>
</div>
  );
}

export default RecipeListView;
