import React, { useState, useEffect, useRef } from 'react';
import { FaCloudUploadAlt, FaTrashAlt, FaSpinner, FaExclamationTriangle, FaServer, FaImage } from 'react-icons/fa';
import api from '../utils/api';
import '../styles/TransferMedia.css';

const TransferMedia = () => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState('');
  const [connectionError, setConnectionError] = useState(false);
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    fetchMedia();
  }, []);
  
  const fetchMedia = async () => {
    setIsLoading(true);
    setError('');
    setConnectionError(false);
    
    try {
      const response = await api.get('/api/media');
      if (response.data.success) {
        setMediaFiles(response.data.media);
      }
    } catch (err) {
      console.error('Error fetching media files:', err);
      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        setConnectionError(true);
      } else {
        setError('Failed to load media files. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  
  const handleRetry = () => {
    fetchMedia();
  };
  
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    setError('');
    setSuccess('');
    setConnectionError(false);
    
    // For demo purposes - create fake Cloudinary URLs when API is unavailable
    if (connectionError) {
      setTimeout(() => {
        const fakeMediaFiles = files.map((file, index) => ({
          _id: `fake-${Date.now()}-${index}`,
          url: URL.createObjectURL(file),
          originalname: file.name,
          createdAt: new Date().toISOString()
        }));
        
        setMediaFiles(prev => [...fakeMediaFiles, ...prev]);
        setSuccess(`Successfully uploaded ${files.length} file${files.length > 1 ? 's' : ''} (Demo Mode)`);
        setIsUploading(false);
        e.target.value = null;
      }, 2000);
      return;
    }
    
    // Create FormData for upload
    const formData = new FormData();
    files.forEach(file => {
      formData.append('media', file);
    });
    
    try {
      // Upload with progress tracking
      const response = await api.post('/api/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });
      
      if (response.data.success) {
        setSuccess(`Successfully uploaded ${files.length} file${files.length > 1 ? 's' : ''}`);
        fetchMedia(); // Refresh the media list
        e.target.value = null; // Clear the file input
      }
    } catch (err) {
      console.error('Error uploading media:', err);
      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        setConnectionError(true);
      } else {
        setError(err.response?.data?.message || 'Failed to upload media. Please try again.');
      }
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDelete = async (mediaId) => {
    if (!window.confirm('Are you sure you want to delete this media? This action cannot be undone.')) {
      return;
    }
    
    setError('');
    setSuccess('');
    
    // For demo mode when API is unavailable
    if (connectionError || mediaId.startsWith('fake-')) {
      setMediaFiles(prevFiles => prevFiles.filter(file => file._id !== mediaId));
      setSuccess('Media deleted successfully (Demo Mode)');
      return;
    }
    
    try {
      const response = await api.delete(`/api/media/${mediaId}`);
      if (response.data.success) {
        setSuccess('Media deleted successfully');
        setMediaFiles(prevFiles => prevFiles.filter(file => file._id !== mediaId));
      }
    } catch (err) {
      console.error('Error deleting media:', err);
      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        setConnectionError(true);
        // Still remove it from UI in demo mode
        setMediaFiles(prevFiles => prevFiles.filter(file => file._id !== mediaId));
        setSuccess('Media deleted successfully (Demo Mode)');
      } else {
        setError(err.response?.data?.message || 'Failed to delete media. Please try again.');
      }
    }
  };

  return (
    <div className="transfer-media-container">
      <h1>Media Library</h1>
      
      {success && (
        <div className="success-message" role="alert">
          {success}
        </div>
      )}
      
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      
      {connectionError && (
        <div className="connection-error-message">
          <FaServer className="connection-error-icon" />
          <div className="connection-error-text">
            <h3>Server Connection Error</h3>
            <p>Cannot connect to the media server. Working in demo mode with limited functionality.</p>
            <button className="retry-button" onClick={handleRetry}>
              Try Again
            </button>
          </div>
        </div>
      )}
      
      <div className="upload-section">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          style={{ display: 'none' }}
          accept="image/*"
          multiple
        />
        
        <button 
          className="upload-btn" 
          onClick={handleUploadClick}
          disabled={isUploading}
        >
          {isUploading ? (
            <span className="uploading-text">
              <FaSpinner className="spinner" /> 
              Uploading... {uploadProgress}%
            </span>
          ) : (
            <span>
              <FaCloudUploadAlt /> Upload Media
            </span>
          )}
        </button>
        
        {isUploading && (
          <div className="progress-bar-container">
            <div 
              className="progress-bar" 
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
        
        {connectionError && (
          <p className="demo-mode-note">
            <FaImage /> Images are stored locally in demo mode.
          </p>
        )}
      </div>
      
      <div className="media-grid-container">
        {isLoading ? (
          <div className="loading-container">
            <FaSpinner className="spinner" />
            <p>Loading your media files...</p>
          </div>
        ) : mediaFiles.length === 0 ? (
          <div className="empty-library">
            <FaExclamationTriangle />
            <p>Your media library is empty. Upload some files to get started.</p>
          </div>
        ) : (
          <div className="media-grid">
            {mediaFiles.map(file => (
              <div className="media-item" key={file._id}>
                <div className="media-thumbnail">
                  <img 
                    src={file.url} 
                    alt={file.originalname || 'Media file'}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = `${process.env.PUBLIC_URL}/images/placeholder-image.png`;
                    }}
                  />
                  <div className="media-overlay">
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(file._id)}
                      aria-label="Delete media"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
                <div className="media-info">
                  <p className="media-name" title={file.originalname}>
                    {file.originalname?.length > 20 
                      ? file.originalname.substring(0, 20) + '...' 
                      : file.originalname || 'Untitled'}
                  </p>
                  <p className="media-date">
                    {new Date(file.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransferMedia;