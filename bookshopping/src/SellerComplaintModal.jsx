// client/src/components/SellerComplaintModal.jsx
import React, { useState } from 'react';
import axios from 'axios';


const SellerComplaintModal = ({ isOpen, onClose, sellerEmail }) => {
  const [text, setText] = useState('');
  console.log(sellerEmail);

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/api/sellercomplaint/submit', {
        email: sellerEmail,
        text,
      }, { withCredentials: true });

      alert('✅ Complaint submitted successfully!');
      setText('');
      onClose(); // close modal
    } catch (err) {
      alert('❌ Failed to submit complaint');
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>Seller Complaint</h3>
        <textarea
          placeholder="Enter your complaint..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          style={styles.textarea}
        />
        <div style={styles.buttonContainer}>
          <button onClick={handleSubmit} style={styles.button}>Submit</button>
          <button onClick={onClose} style={styles.cancelButton}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
    justifyContent: 'center', alignItems: 'center',
    zIndex: 999
  },
  modal: {
    background: 'white', padding: 20, borderRadius: 10, width: '300px'
  },
  textarea: {
    width: '100%', padding: '10px', borderRadius: '5px'
  },
  buttonContainer: {
    marginTop: '10px', display: 'flex', justifyContent: 'space-between'
  },
  button: {
    backgroundColor: '#28a745', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '5px'
  },
  cancelButton: {
    backgroundColor: '#dc3545', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '5px'
  }
};

export default SellerComplaintModal;
