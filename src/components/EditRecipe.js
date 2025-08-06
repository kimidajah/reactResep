import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({
    name: '',
    ingredients: '',
    instructions: '',
    prepTime: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const docRef = doc(db, 'resep', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setRecipe(docSnap.data());
        } else {
          setError('Resep tidak ditemukan');
          navigate('/recipes');
        }
      } catch (err) {
        setError('Error mengambil data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi form
    if (!recipe.name.trim()) {
      alert('Nama makanan harus diisi');
      return;
    }
    if (!recipe.ingredients.trim()) {
      alert('Bahan-bahan harus diisi');
      return;
    }
    if (!recipe.instructions.trim()) {
      alert('Cara pembuatan harus diisi');
      return;
    }
    if (!recipe.prepTime.trim()) {
      alert('Waktu persiapan harus diisi');
      return;
    }

    try {
      setSaving(true);
      const docRef = doc(db, 'resep', id);
      await updateDoc(docRef, {
        ...recipe,
        updatedAt: new Date()
      });
      navigate('/recipes');
    } catch (err) {
      alert('Gagal menyimpan perubahan: ' + err.message);
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div style={{ 
        maxWidth: '600px', 
        margin: '50px auto', 
        padding: '20px',
        textAlign: 'center' 
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        maxWidth: '600px', 
        margin: '50px auto', 
        padding: '20px',
        textAlign: 'center',
        color: 'red' 
      }}>
        <p>{error}</p>
        <button
          onClick={() => navigate('/recipes')}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: '#007bff',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Kembali ke Daftar Resep
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Edit Resep</h2>
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
          {recipe.imageUrl && (
            <img
              src={recipe.imageUrl}
              alt="Preview"
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                marginTop: '10px',
                borderRadius: '4px'
              }}
            />
          )}
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
            disabled={saving}
            style={{
              padding: '10px 20px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: saving ? '#ccc' : '#007bff',
              color: 'white',
              cursor: saving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditRecipe;
