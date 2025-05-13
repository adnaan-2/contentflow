import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import addHours from 'date-fns/addHours';
import { FaCalendarAlt, FaImage, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaTimes, FaPlus } from 'react-icons/fa';
import api from '../utils/api';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/Schedule.css';

const locales = {
  'en-US': require('date-fns/locale/en-US')
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

const Schedule = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('12:00');
  const [showModal, setShowModal] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [postText, setPostText] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    facebook: false,
    twitter: false,
    instagram: false,
    linkedin: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch existing scheduled posts
  useEffect(() => {
    fetchScheduledPosts();
  }, []);

  const fetchScheduledPosts = async () => {
    try {
      const response = await api.get('/api/schedule');
      if (response.data.success) {
        // Convert string dates to Date objects
        const formattedEvents = response.data.schedules.map(event => ({
          ...event,
          start: new Date(event.scheduledDateTime),
          end: addHours(new Date(event.scheduledDateTime), 1),
          title: `Post to ${event.platforms.join(', ')}`
        }));
        setEvents(formattedEvents);
      }
    } catch (err) {
      console.error('Error fetching scheduled posts:', err);
      // Just log the error, don't show an error message to user
    }
  };

  // Fetch media when modal opens
  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/media');
      if (response.data.success) {
        setMediaFiles(response.data.media);
      }
    } catch (err) {
      console.error('Error fetching media:', err);
      setError('Could not load media files. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (slotInfo) => {
    setSelectedDate(slotInfo.start);
    setShowModal(true);
    fetchMedia();
  };

  const handleMediaSelect = (media) => {
    setSelectedMedia(media);
  };

  const handlePlatformToggle = (platform) => {
    setSelectedPlatforms(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };

  const handleScheduleSubmit = async () => {
    // Validate inputs
    if (!selectedMedia) {
      setError('Please select an image to post');
      return;
    }

    if (!Object.values(selectedPlatforms).some(Boolean)) {
      setError('Please select at least one platform');
      return;
    }

    // Create DateTime from date and time
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const scheduledDateTime = new Date(selectedDate);
    scheduledDateTime.setHours(hours, minutes, 0, 0);

    // Prepare platforms array
    const platforms = Object.entries(selectedPlatforms)
      .filter(([_, isSelected]) => isSelected)
      .map(([platform]) => platform);

    try {
      const payload = {
        mediaId: selectedMedia._id,
        scheduledDateTime: scheduledDateTime.toISOString(),
        platforms,
        caption: postText
      };

      const response = await api.post('/api/schedule', payload);
      
      if (response.data.success) {
        // Add the new event to the calendar
        const newEvent = {
          id: response.data.schedule._id,
          title: `Post to ${platforms.join(', ')}`,
          start: scheduledDateTime,
          end: addHours(scheduledDateTime, 1),
          mediaUrl: selectedMedia.url,
          platforms
        };
        
        setEvents([...events, newEvent]);
        setSuccess('Post has been scheduled successfully!');
        
        // Log success to console
        console.log('Post scheduled successfully for:', scheduledDateTime);
        console.log('Platforms:', platforms);
        console.log('Media:', selectedMedia.url);
        console.log('Caption:', postText);
        
        // Reset form after delay
        setTimeout(() => {
          setShowModal(false);
          setSelectedMedia(null);
          setPostText('');
          setSelectedPlatforms({
            facebook: false,
            twitter: false,
            instagram: false,
            linkedin: false
          });
          setError('');
          setSuccess('');
        }, 2000);
      }
    } catch (err) {
      console.error('Error scheduling post:', err);
      setError('Failed to schedule post. Please try again.');
    }
  };

  // Generate time options for the dropdown (30 minute intervals)
  const timeOptions = [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 30) {
      const hour = i.toString().padStart(2, '0');
      const minute = j.toString().padStart(2, '0');
      timeOptions.push(`${hour}:${minute}`);
    }
  }

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <h1><FaCalendarAlt /> Content Schedule</h1>
        <p>Plan and schedule your content across multiple platforms</p>
      </div>

      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          selectable
          onSelectSlot={handleDateSelect}
          views={['month', 'week', 'day']}
        />
      </div>

      {/* Scheduling Modal */}
      {showModal && (
        <div className="schedule-modal-overlay">
          <div className="schedule-modal">
            <div className="modal-header">
              <h2>Schedule New Post</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="modal-body">
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <div className="form-group">
                <label>Date & Time</label>
                <div className="datetime-picker">
                  <div className="selected-date">
                    {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
                  </div>
                  <select 
                    value={selectedTime} 
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="time-select"
                  >
                    {timeOptions.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Select Media</label>
                {isLoading ? (
                  <div className="loading-media">Loading media...</div>
                ) : mediaFiles.length === 0 ? (
                  <div className="no-media">
                    No media found. Please upload some images first.
                  </div>
                ) : (
                  <div className="media-grid">
                    {mediaFiles.map(media => (
                      <div 
                        key={media._id} 
                        className={`media-item ${selectedMedia?._id === media._id ? 'selected' : ''}`}
                        onClick={() => handleMediaSelect(media)}
                      >
                        <img src={media.url} alt={media.originalname} />
                        {selectedMedia?._id === media._id && (
                          <div className="selected-overlay">
                            <FaPlus className="selected-icon" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Caption</label>
                <textarea
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder="Write a caption for your post..."
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>Select Platforms</label>
                <div className="platform-buttons">
                  <button
                    type="button"
                    className={`platform-btn ${selectedPlatforms.facebook ? 'selected' : ''} facebook`}
                    onClick={() => handlePlatformToggle('facebook')}
                  >
                    <FaFacebookF /> Facebook
                  </button>
                  <button
                    type="button"
                    className={`platform-btn ${selectedPlatforms.twitter ? 'selected' : ''} twitter`}
                    onClick={() => handlePlatformToggle('twitter')}
                  >
                    <FaTwitter /> Twitter
                  </button>
                  <button
                    type="button"
                    className={`platform-btn ${selectedPlatforms.instagram ? 'selected' : ''} instagram`}
                    onClick={() => handlePlatformToggle('instagram')}
                  >
                    <FaInstagram /> Instagram
                  </button>
                  <button
                    type="button"
                    className={`platform-btn ${selectedPlatforms.linkedin ? 'selected' : ''} linkedin`}
                    onClick={() => handlePlatformToggle('linkedin')}
                  >
                    <FaLinkedinIn /> LinkedIn
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="schedule-btn"
                onClick={handleScheduleSubmit}
              >
                Schedule Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;