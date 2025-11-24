import axios from 'axios';

// Hardcoded backend URL
const API_BASE_URL = 'gateway/api/v1';

// Hardcoded token
const AUTH_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJsY2xDWElQOHkzajVsUWgzb2FCX0I2em5XV1JleXhEVEhtbzBlOTRNQkdZIn0.eyJleHAiOjE3NjQwMzU1ODgsImlhdCI6MTc2Mzk5OTU4OCwianRpIjoidHJydGNjOjJkZGYyYmQxLWRmOGEtYjVhOS1jMTc4LWU0MTRiNzNjMzNkNyIsImlzcyI6Imh0dHA6Ly8xOTIuMTY4LjIyOC4xMzQ6OTk5OS9yZWFsbXMvbnMtYXBwIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjkwODU5ZDVjLTA2OTAtNGY1My04ODNiLTZiMWE4YTRmM2NjZCIsInR5cCI6IkJlYXJlciIsImF6cCI6Im5zLWFwcC1hcGkiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIi8qIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLW5zLWFwcCIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJucy1hcHAtYXBpIjp7InJvbGVzIjpbInVtYV9wcm90ZWN0aW9uIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImNsaWVudEhvc3QiOiIxOTIuMTY4LjIyOC4xIiwicHJlZmVycmVkX3VzZXJuYW1lIjoic2VydmljZS1hY2NvdW50LW5zLWFwcC1hcGkiLCJjbGllbnRBZGRyZXNzIjoiMTkyLjE2OC4yMjguMSIsImNsaWVudF9pZCI6Im5zLWFwcC1hcGkifQ.Fh8iGxZ1es2h1VZC2vucJIlRJe5QnvdrXxntySVadjqez7mgT4ApoYIxEYKYaaMh0ELNtmRAWQlbSepE3IyQufnDcXseP9PnxrwKuRQB-yBKx4bU4S9oyUEFjkImHG1jMVJTNT30bbQ-X_zI6MFnLYfljOghXNQ-fJIQllXO60KJHUU-5zzpffh0ZODJwdphY8PsY4vZ2wtbixV6Nlr0M4dqj4HA5oKkix-TIga4KTkoOf6HRyKBUAoWAd1pSL4Y7UHPglCD5NkEjiqmlwc4_AZiCbo-J_vDGamLfbkH_sqFUPg1wtu6JGzuOY8xbJmv1bd6fwijmC32twbN7ZkC2g';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${AUTH_TOKEN}`, // add token
  },
});

// Optional: interceptors for handling 401 or errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized. Token may be invalid.');
      // Optionally redirect to login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

