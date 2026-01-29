import apiClient from '../config';

const userService = {
  // Update user profile
  updateProfile: async (userData) => {
    const response = await apiClient.put('/user/update', userData);
    return response.data;
  }
};

export default userService;