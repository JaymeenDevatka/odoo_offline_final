import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' }); // Your server URL

// Add the JWT to every request if it exists
API.interceptors.request.use((req) => {
    if (localStorage.getItem('token')) {
        req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    }
    return req;
});

// Authentication calls
export const register = (formData) => API.post('/auth/register', formData);
export const login = (formData) => API.post('/auth/login', formData);

// Booking calls
export const createBooking = (bookingData) => API.post('/bookings', bookingData);
export const getMyBookings = () => API.get('/bookings/my-bookings');