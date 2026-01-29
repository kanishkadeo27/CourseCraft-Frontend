import { useState, useEffect } from 'react';
import { contactService } from '../api';
import useApi from '../hooks/useApi';

// Example 1: Contact Form API Usage
const ContactFormExample = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const { loading, error, execute: submitContact } = useApi(contactService.submitContactForm);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitContact(formData);
      alert('Contact form submitted successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Failed to submit contact form:', err);
    }
  };

  return (
    <div>
      <h2>Contact Form API Example</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <textarea
          placeholder="Message"
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

// Example 2: Using useApi hook pattern
const ApiHookExample = () => {
  const { loading, error, execute: submitForm } = useApi(contactService.submitContactForm);
  const [message, setMessage] = useState('');

  const handleQuickSubmit = async () => {
    try {
      await submitForm({
        name: "Test User",
        email: "test@example.com",
        message: message || "Test message"
      });
      alert('Form submitted successfully!');
      setMessage('');
    } catch (err) {
      console.error('Failed to submit:', err);
    }
  };

  return (
    <div>
      <h2>API Hook Pattern Example</h2>
      <textarea
        placeholder="Enter your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleQuickSubmit} disabled={loading}>
        {loading ? 'Submitting...' : 'Quick Submit'}
      </button>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export { ContactFormExample, ApiHookExample };