import React, { useState } from 'react';
import styles from './NotesEditor.module.css';

const NotesEditor = ({ initial, onSave, placeholder }) => {
  // Render existing notes and provide an empty textarea to add a new note.
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!text || !text.trim()) return;
    setSaving(true);
    try {
      await onSave(text.trim());
      setText('');
    } finally {
      setSaving(false);
    }
  };

  const renderExisting = () => {
    if (!initial) return null;
    const items = String(initial)
      .split(/\n|\r|\r\n|\u2022|•/)
      .map((n) => n.trim())
      .filter(Boolean);
    if (!items.length) return null;
    return (
      <ul className={styles.existingList}>
        {items.map((item, i) => (
          <li key={i} className={styles.existingItem}>{item}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className={styles.container}>
      {renderExisting()}
      <div style={{display:'flex',flexDirection:"row",}}>
        <input type="text" value={text} placeholder='Add note' onChange={(e) => setText(e.target.value)} />
        <div className={styles.actions}>
          <button className={styles.save} onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Add note'}
          </button>
        </div>

      </div>
      
    </div>
  );
};

export default NotesEditor;
