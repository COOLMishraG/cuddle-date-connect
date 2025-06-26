// API Base URL - replace with your actual backend URL
export const API_BASE_URL = 'http://localhost:3000'; // Your backend port
// Note: Make sure your backend redirects to the correct frontend port
// If your frontend runs on port 8080, set FRONTEND_URL=http://localhost:8080 in your backend

import { User } from '@/types/user';
import { Pet, PetData } from '@/types/pet';

// User-related API calls
export const userApi = {
  // Create a new user
  createUser: async (userData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          // Ensure these fields are included as the backend needs them
          displayName: userData.displayName || userData.name,
          username: userData.username || (userData.email ? userData.email.split('@')[0] : null)
        }),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        // Handle specific error types from backend
        if (response.status === 409) {
          throw new Error(errorData.message || 'User with this email or username already exists');
        }
        throw new Error(errorData.message || 'Failed to create user');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },
  
  // Update user profile
  updateUser: async (userId: string, userData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        // Handle specific error types from backend
        if (response.status === 404) {
          throw new Error(`User with ID ${userId} not found`);
        }
        throw new Error(errorData.message || 'Failed to update user');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },
  
  // Upload profile photo
  uploadProfilePhoto: async (userId: string, photoFile: File) => {
    try {
      const formData = new FormData();
      formData.append('profileImage', photoFile);
      
      const response = await fetch(`${API_BASE_URL}/users/${userId}/profile-photo`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload profile photo');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  },
  
  // Get user profile
  getUserProfile: async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get user profile');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },
  
  // Get user by username
  getUserByUsername: async (username: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/username/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 404) {
          throw new Error(`User with username ${username} not found`);
        }
        throw new Error(errorData.message || 'Failed to get user by username');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting user by username:', error);
      throw error;
    }
  },
  
  // Get user by email
  getUserByEmail: async (email: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/email/${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 404) {
          throw new Error(`User with email ${email} not found`);
        }
        throw new Error(errorData.message || 'Failed to get user by email');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  },
  
  // Check if username or email exists (for registration validation)
  checkUserExists: async (email: string, username: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/exists?email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error checking if user exists:', error);
      throw error;
    }
  }
};;

// Pet-related API calls
export const petApi = {
  // Create a new pet
  createPet: async (petData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(petData),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 400) {
          throw new Error(errorData.message || 'Invalid pet data');
        }
        throw new Error(errorData.message || 'Failed to create pet');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating pet:', error);
      throw error;
    }
  },
  
  // Upload pet photo
  uploadPetPhoto: async (petId: string, photoFile: File) => {
    try {
      const formData = new FormData();
      formData.append('petImage', photoFile);
      
      const response = await fetch(`${API_BASE_URL}/pets/${petId}/photo`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload pet photo');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error uploading pet photo:', error);
      throw error;
    }
  },
  
  // Update pet
  updatePet: async (petId: string, petData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pets/${petId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(petData),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 404) {
          throw new Error(`Pet with ID ${petId} not found`);
        }
        throw new Error(errorData.message || 'Failed to update pet');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating pet:', error);
      throw error;
    }
  },
  
  // Get user's pets
  getUserPets: async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/pets`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get user pets');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting pets:', error);
      throw error;
    }
  }
};

// Auth-related API calls
export const authApi = {
  // Login with username and password only
  login: async (username: string, password: string) => {
    try {
      console.log('Attempting login with username:', username);
      
      // Try logging in with username only
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: username, 
          password
        }),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login failed:', errorData);
        
        // Handle specific error types
        if (response.status === 404) {
          throw new Error('User not found. Please check your username.');
        }
        if (response.status === 401) {
          throw new Error('Invalid credentials');
        }
        throw new Error(errorData.message || 'Authentication failed');
      }
      
      const result = await response.json();
      console.log('Login successful:', result);
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
    /**
   * Register a new user and create their account
   * This function uses the userApi.createUser function as there's no dedicated auth/register endpoint
   */
  register: async (userData: any) => {
    try {
      // Use the userApi.createUser function to create the user
      const result = await userApi.createUser(userData);
      
      // Log the entire response to see its structure
      console.log('User creation response:', result);
      
      // Check if the response has a nested user object (common backend pattern)
      if (result.user) {
        // Backend returned { user: {...}, token: "..." } format
        console.log('Extracting user data from nested response');
        return result.user;
      } else if (result.id) {
        // Backend returned user data directly
        console.log('Using direct user data response');
        return result;
      } else {
        console.error('Unexpected response format:', result);
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  // Logout the current user
  // Note: This endpoint might not exist on your backend
  logout: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Logout failed');
      }
      
      return true;
    } catch (error) {
      console.error('Logout error (endpoint might not exist):', error);
      throw error;
    }
  },
  
  // Check if the user is authenticated
  // Note: This endpoint might not exist on your backend
  // Comment out if you don't have /auth/session endpoint
  checkSession: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/session`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          // User is not authenticated
          return null;
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || 'Session check failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Session check error (endpoint might not exist):', error);
      throw error;
    }
  },
  
  // Validate OAuth token
  validateToken: async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid token');
      }
      
      const result = await response.json();
      
      // Handle different response formats from your backend
      if (result.user) {
        // Backend returned { user: {...}, token: "..." } format
        return result;
      } else if (result.id) {
        // Backend returned user data directly
        return { user: result };
      } else {
        // Backend returned some other format
        return result;
      }
    } catch (error) {
      console.error('Token validation error:', error);
      throw error;
    }
  }
};
