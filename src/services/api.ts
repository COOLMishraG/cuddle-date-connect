// API Base URL - replace with your actual backend URL
export const API_BASE_URL = 'https://pet-match-backbone.onrender.com'; // Your backend port
// Note: Make sure your backend redirects to the correct frontend port
// If your frontend runs on port 8080, set FRONTEND_URL=http://localhost:8080 in your backend

// Posts API Base URL - ECS public IP for post-related endpoints
export const POSTS_API_BASE_URL = 'http://35.170.187.9';

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
  
  // Update user by username
  updateUserByUsername: async (username: string, userData: Partial<User>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/username/${username}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user by username');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating user by username:', error);
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

  getAllSitters: async (): Promise<User[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/sitters`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get all sitters');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting all sitters:', error);
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
  },

  // Update sitter spec by username
  updateSitterSpec: async (username: string, sitterSpecData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sitter-spec/${username}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sitterSpecData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update sitter spec');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating sitter spec:', error);
      throw error;
    }
  },

  // Get sitter spec by username
  getSitterSpecByUsername: async (username: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sitter-spec/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get sitter spec');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting sitter spec:', error);
      throw error;
    }
  }
};

// Pet-related API calls
export const petApi = {
  // Create a new pet using owner username
  createPet: async (petData: any, ownerUsername: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pets/by-username`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...petData,
          ownerUsername: ownerUsername
        }),
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

  // Alternative: Create pet using owner ID (if needed)
  createPetByOwnerId: async (petData: any, ownerId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...petData,
          ownerId: ownerId
        }),
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
  
  // Get user's pets by username
  getUserPets: async (username: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pets/owner/${username}`, {
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
  },

  // Get all pets
  getAllPets: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pets`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get pets');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting all pets:', error);
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

// Match-related API calls
export const matchApi = {
  // Get pet matches for breeding
  getPetMatches: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pets/match`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get pet matches');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting pet matches:', error);
      throw error;
    }
  },
  
  // Get matches for a specific pet
  getPetMatchesById: async (petId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pets/${petId}/matches`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get matches for pet');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting pet matches by ID:', error);
      throw error;
    }
  },

  // Create a new match request
  createMatchRequest: async (matchData: {
    requesterPetId: string;
    recipientPetId: string;
    message: string;
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/matches/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(matchData),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create match request');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating match request:', error);
      throw error;
    }
  },

  // Get match requests received by the current user
  getReceivedMatchRequests: async (userName?: string, status?: string) => {
    try {
      let url = `${API_BASE_URL}/matches/received`;

      // If userName is provided, use the specific endpoint
      if (userName) {
        url = `${API_BASE_URL}/matches/received/${userName}`;
        if (status) {
          url += `?status=${status}`;
        }
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get received match requests');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting received match requests:', error);
      throw error;
    }
  },

  // Get match requests sent by the current user
  getSentMatchRequests: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/matches/sent`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get sent match requests');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting sent match requests:', error);
      throw error;
    }
  },

  // Approve a match request
  approveMatchRequest: async (matchId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/matches/${matchId}/respond/by-username`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          approve: true 
        }),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to approve match request');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error approving match request:', error);
      throw error;
    }
  },

  // Reject a match request
  rejectMatchRequest: async (matchId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/matches/${matchId}/respond/by-username`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          approve: false 
        }),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reject match request');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error rejecting match request:', error);
      throw error;
    }
  }
};

// Vet-related API calls
export const vetApi = {
  // Get all vets
  getAllVets: async (): Promise<User[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/vets`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get vets');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting vets:', error);
      throw error;
    }
  },

  // Save pet sitter service details
  saveSitterService: async (username: string, serviceData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pet-sitter-spec/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save sitter service details');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving sitter service:', error);
      throw error;
    }
  }
};

// Post-related API calls
export const postApi = {
  // Create a new post
  createPost: async (postData: { content: string; owner: string; imageUri?: string }) => {
    try {
      const response = await fetch(`${POSTS_API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create post');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  // Get all posts
  getAllPosts: async () => {
    try {
      const response = await fetch(`${POSTS_API_BASE_URL}/posts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get posts');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting posts:', error);
      throw error;
    }
  },

  // Get a specific post
  getPost: async (postId: string) => {
    try {
      const response = await fetch(`${POSTS_API_BASE_URL}/posts/${postId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get post');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting post:', error);
      throw error;
    }
  },

  // Update a post
  updatePost: async (postId: string, postData: { content?: string; imageUri?: string }) => {
    try {
      const response = await fetch(`${POSTS_API_BASE_URL}/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update post');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  // Delete a post
  deletePost: async (postId: string) => {
    try {
      const response = await fetch(`${POSTS_API_BASE_URL}/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete post');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },

  // Like a post
  likePost: async (postId: string) => {
    try {
      const response = await fetch(`${POSTS_API_BASE_URL}/posts/${postId}/like`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to like post');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  }
};

// Comment-related API calls
export const commentApi = {
  // Create a new comment
  createComment: async (commentData: { content: string; author: string; postId: string }) => {
    try {
      const response = await fetch(`${POSTS_API_BASE_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create comment');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },

  // Get all comments
  getAllComments: async () => {
    try {
      const response = await fetch(`${POSTS_API_BASE_URL}/comments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get comments');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting comments:', error);
      throw error;
    }
  },

  // Get comments for a specific post
  getPostComments: async (postId: string) => {
    try {
      const response = await fetch(`${POSTS_API_BASE_URL}/comments/post/${postId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get post comments');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting post comments:', error);
      throw error;
    }
  },

  // Get a specific comment
  getComment: async (commentId: string) => {
    try {
      const response = await fetch(`${POSTS_API_BASE_URL}/comments/${commentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get comment');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting comment:', error);
      throw error;
    }
  },

  // Update a comment
  updateComment: async (commentId: string, commentData: { content?: string }) => {
    try {
      const response = await fetch(`${POSTS_API_BASE_URL}/comments/${commentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update comment');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  },

  // Delete a comment
  deleteComment: async (commentId: string) => {
    try {
      const response = await fetch(`${POSTS_API_BASE_URL}/comments/${commentId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete comment');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
};

// General image upload API (for community posts, etc.)
export const imageApi = {
  // Upload image for community posts
  uploadImage: async (imageFile: File) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await fetch(`${POSTS_API_BASE_URL}/upload/image`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }
      
      const result = await response.json();
      return result.url || result.imageUrl || result.secure_url; // Handle different response formats
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
};
