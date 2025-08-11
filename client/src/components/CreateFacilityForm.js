import React, { useState } from 'react';
import axios from 'axios';

const CreateFacilityForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            // Get the token from localStorage to include in the request header
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication error. Please log in again.');
                return;
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };
            
            // The backend endpoint to create a facility
            const response = await axios.post('http://localhost:5000/api/facilities', formData, config);
            
            setMessage(response.data.message); // Show success message from the server
            setFormData({ name: '', description: '', address: '' }); // Clear the form
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create facility.');
        }
    };

    return (
        <div>
            <h3>Add Your Facility</h3>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" value={formData.name} placeholder="Facility Name" onChange={handleChange} required />
                <br />
                <textarea name="description" value={formData.description} placeholder="A brief description of your facility" onChange={handleChange} required />
                <br />
                <input type="text" name="address" value={formData.address} placeholder="Address" onChange={handleChange} required />
                <br />
                <button type="submit">Create Facility</button>
            </form>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default CreateFacilityForm;