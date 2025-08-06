import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

function CreateRecipe() {
  const [recipe, setRecipe] = useState({
    name: '',
    ingredients: '',
    instructions: '',
    prepTime: '',
    imageUrl: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (recipe.name.trim() && recipe.ingredients.trim()) {
      try {
        console.log('Attempting to save recipe:', recipe);
        const docRef = await addDoc(collection(db, 'resep'), {
          ...recipe,
          createdAt: new Date().toISOString()
        });
        console.log('Recipe successfully added with ID: ', docRef.id);
        console.log('Full recipe data:', {
          ...recipe,
          id: docRef.id,
          createdAt: new Date().toISOString()
        });
        navigate('/recipes');
      } catch (error) {
        console.error('Error details:', error);
        console.error('Error adding recipe: ', error.message);
        alert('Gagal menyimpan resep: ' + error.message);
      }
    } else {
      alert('Nama dan bahan-bahan harus diisi');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Tambah Resep Makanan Ringan</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Nama Makanan:</label>
          <input
            type="text"
            name="name"
            value={recipe.name}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
            placeholder="Contoh: Cheese Stick"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>URL Gambar:</label>
          <input
            type="text"
            name="imageUrl"
            value={recipe.imageUrl}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
            placeholder="Masukkan URL gambar (contoh: https://example.com/image.jpg)"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Bahan-bahan:</label>
          <textarea
            name="ingredients"
            value={recipe.ingredients}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              minHeight: '100px'
            }}
            placeholder="Masukkan bahan-bahan (satu per baris)"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Cara Pembuatan:</label>
          <textarea
            name="instructions"
            value={recipe.instructions}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              minHeight: '150px'
            }}
            placeholder="Masukkan langkah-langkah pembuatan"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Waktu Persiapan:</label>
          <input
            type="text"
            name="prepTime"
            value={recipe.prepTime}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
            placeholder="Contoh: 30 menit"
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => navigate('/recipes')}
            style={{
              padding: '10px 20px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              backgroundColor: '#f5f5f5',
              cursor: 'pointer'
            }}
          >
            Batal
          </button>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#007bff',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Simpan Resep
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateRecipe;
