import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#f8f9fa',
      padding: '20px',
      textAlign: 'center',
      position: 'fixed',
      bottom: 0,
      width: '100%',
      borderTop: '1px solid #dee2e6'
    }}>
      <div>
        <h5>Muhamad Hilman Nur Hakim</h5>
        <div style={{ marginTop: '10px' }}>
          <a href="https://www.instagram.com/hilmnnur/" 
             target="_blank" 
             rel="noopener noreferrer"
             style={{ marginRight: '15px', color: '#E1306C', textDecoration: 'none' }}>
            Instagram
          </a>
          <a href="https://www.linkedin.com/in/muhamad-hilman-nur-hakim-0aa0b0329/" 
             target="_blank" 
             rel="noopener noreferrer"
             style={{ color: '#0077B5', textDecoration: 'none' }}>
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
