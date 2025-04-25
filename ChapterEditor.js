import { useState } from 'react';
import { useRouter } from 'next/router';
import { chaptersService } from '../firebase';

export default function ChapterEditor({ chapterId, initialData = { title: '', content: '' } }) {
  const [title, setTitle] = useState(initialData.title || '');
  const [content, setContent] = useState(initialData.content || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Please enter a chapter title');
      return;
    }

    try {
      setIsSaving(true);
      setError('');
      setSuccessMessage('');

      const chapterData = {
        title,
        content,
        order: parseInt(chapterId.replace('chapter', ''), 10)
      };

      const success = await chaptersService.saveChapter(chapterId, chapterData);
      
      if (success) {
        setSuccessMessage('Chapter saved successfully!');
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError('Failed to save chapter. Please try again.');
      }
    } catch (error) {
      console.error('Error saving chapter:', error);
      setError('An error occurred while saving the chapter.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBulkImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsSaving(true);
      setError('');
      
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const text = event.target.result;
          setContent(text);
          
          // Auto-save after import
          const chapterData = {
            title,
            content: text,
            order: parseInt(chapterId.replace('chapter', ''), 10)
          };
          
          const success = await chaptersService.saveChapter(chapterId, chapterData);
          
          if (success) {
            setSuccessMessage('Chapter imported and saved successfully!');
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
          } else {
            setError('Failed to save imported chapter. Please try again.');
          }
        } catch (error) {
          console.error('Error processing imported file:', error);
          setError('An error occurred while processing the imported file.');
        } finally {
          setIsSaving(false);
        }
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Error importing chapter:', error);
      setError('An error occurred while importing the chapter.');
      setIsSaving(false);
    }
  };

  return (
    <div className="card">
      <h3>Edit Chapter</h3>
      
      {error && (
        <div className="error-message mb-2" style={{ color: 'red' }}>
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="success-message mb-2" style={{ color: 'green' }}>
          {successMessage}
        </div>
      )}
      
      <div className="form-group">
        <label htmlFor="title" className="form-label">Chapter Title</label>
        <input
          type="text"
          id="title"
          className="form-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter chapter title"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="content" className="form-label">Chapter Content</label>
        <textarea
          id="content"
          className="form-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter chapter content"
          rows={15}
        />
      </div>
      
      <div className="d-flex justify-center space-between mb-3">
        <button
          onClick={handleSave}
          className="btn btn-primary"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Chapter'}
        </button>
        
        <div>
          <label htmlFor="bulk-import" className="btn btn-secondary">
            Import Text File
          </label>
          <input
            type="file"
            id="bulk-import"
            accept=".txt,.md,.text"
            style={{ display: 'none' }}
            onChange={handleBulkImport}
          />
        </div>
        
        <button
          onClick={() => router.back()}
          className="btn btn-secondary"
          disabled={isSaving}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
