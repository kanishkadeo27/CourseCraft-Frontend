import apiClient from '../config';

const contactService = {
  // Submit contact form
  submitContactForm: async (contactData) => {
    const response = await apiClient.post('/contactus', contactData);
    return response.data;
  }
};

export default contactService;