import axios from 'axios';

// Hardcoded backend URL
const API_BASE_URL = 'http://192.168.1.24:8222/api/v1';

// Hardcoded token
const AUTH_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJZRXJjdjA0X0E4SlUtcnQxVzA4S3dzMjVmY1hoYzVZbzRmNkpsSUV6Y1hjIn0.eyJleHAiOjE3NjM4ODA1MTAsImlhdCI6MTc2Mzg0NDUxMCwianRpIjoidHJydGNjOjA5ODExZDA2LWQ5OGMtOTcyZi0zNGJiLTA3MmYwODJiM2Q0NCIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6OTk5OS9yZWFsbXMvbnMtYXBwIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjM0YjQwZDRjLWVlYjUtNGY4YS1hMjFkLWFjNzMzMzFiNzRjNyIsInR5cCI6IkJlYXJlciIsImF6cCI6Im5zLWFwcC1hcGkiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIi8qIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLW5zLWFwcCIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJucy1hcHAtYXBpIjp7InJvbGVzIjpbInVtYV9wcm90ZWN0aW9uIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJjbGllbnRIb3N0IjoiMTcyLjE3LjAuMSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicHJlZmVycmVkX3VzZXJuYW1lIjoic2VydmljZS1hY2NvdW50LW5zLWFwcC1hcGkiLCJjbGllbnRBZGRyZXNzIjoiMTcyLjE3LjAuMSIsImNsaWVudF9pZCI6Im5zLWFwcC1hcGkifQ.M0OzuAFEwb88ZgIBn0Zb55dVL6JcF7yHLDoCCbV5iOWBvU3YF5tTrVv50ecT_I2EO8MNblN3ojFdn0IPU58Ia7V69_43GVcL_AA_onXWmqsrBY0PZsTWPil_t-xL9MfzskJ6nqqp-xijWtO-nF32rsqGoyb2ytrhOXlNGKjn5wKW77lkJf6clM2Cssmx5f3F8zKkS9On6JsESjiX_nsdxFinxj-IlgU0_WL2nuq1zar7ZsMabo8RMDj_RShZNu0I6iNt-9kBFgi9FQZ3U73445O7eJUhw0IMjx7K0FcUS4BW-VMxOeva0i1uUrSrKqGtDdiBzQEAG9kDWXZHQlafOw';

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

