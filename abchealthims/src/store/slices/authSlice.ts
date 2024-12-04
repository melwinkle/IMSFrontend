import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {  User } from '../../types/user';
import authApi from '../../services/authApi';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  isAuthenticated: boolean;
  users: User[];
  selectedUser: User | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user')||'null') || null,
  isLoading: false,
  error: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  users: [],
  selectedUser: null,
};

// Async Thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }: { username: string; password: string }) => {
    const response = await authApi.login(username, password);
    localStorage.setItem('token', response.token);
    return response;
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    await authApi.logout();
    localStorage.removeItem('token');
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: any) => {
    const response = await authApi.register(userData);
    return response;
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ userId, userData }: { userId: string; userData: any }) => {
    const response = await authApi.updateUser(userId, userData);
    return response;
  }
);

export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async () => {
    const response = await authApi.getProfile();
    return response;
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) => {
    const response = await authApi.changePassword({ old_password: oldPassword, new_password: newPassword });
    return response;
  }
);

export const fetchUsers = createAsyncThunk(
  'auth/fetchUsers',
  async () => {
    const response = await authApi.listUsers();
    return response;
  }
);

export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (userId: string) => {
    const response = await authApi.getUser(userId);
    return response;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.isAuthenticated = false;
      state.users = [];
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isAuthenticated = false;
      })
      .addCase(login.fulfilled, (state,action) => {
        state.isLoading = false;
        state.user = action.payload.user as User;
        state.token = action.payload.token;
        state.isAuthenticated = true;


        
      })
      .addCase(login.rejected, (state,action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to login';
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isLoading = false;
        state.isAuthenticated = false;
        localStorage.removeItem('user');
      })
      .addCase(logout.rejected, (state,action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to logout';
      })

      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state,action) => {
        state.isLoading = false;
        state.users?.push(action.payload);
      })
      .addCase(register.rejected, (state,action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to register';
        state.isAuthenticated = false;
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state,action) => {
        state.isLoading = false;
        // Check if the updated user is the currently logged-in user
        if (state.user && state.user.id === action.payload.id) {
          state.user = action.payload; // Update the logged-in user's state
          localStorage.setItem('user', JSON.stringify(action.payload)); // Update local storage
        }

        // If an admin updates another user's profile, update the users array
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload; // Update the user in the users array
        }
      
      })
      .addCase(updateProfile.rejected, (state,action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update profile';
      })

      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state,action) => {
        state.isLoading = false;
        state.user = action.payload as User;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(getProfile.rejected, (state,action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch profile';
      })

      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(changePassword.rejected, (state,action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to change password';
      })

      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state,action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state,action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })


      // Fetch User
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const fetchedUser = action.payload as User; // Assert the type as User
        state.selectedUser = fetchedUser;
      
        // Update the users array with the fetched user
        if (state.users) {
          const index = state.users.findIndex(user => user.id === fetchedUser.id);
          if (index !== -1) {
            state.users[index] = fetchedUser; // Update the existing user
          } else {
            state.users.push(fetchedUser); // Add new user if not found
          }
        }
      })
      .addCase(fetchUser.rejected, (state,action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch user';
      })
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;