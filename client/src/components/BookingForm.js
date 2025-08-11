import React, { useState } from 'react';
import { createBooking } from '../api/apiService';

const BookingForm = ({ courtId }) => {
    const [bookingStartTime, setBookingStartTime] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // (Add logic for selecting end time and calculating price)
            const bookingData = { courtId, bookingStartTime, bookingEndTime: '...' };
            await createBooking(bookingData);
            [cite_start]// On success, redirect to "My Bookings" page [cite: 47]
            window.location.href = '/my-bookings'; 
        } catch (err) {
            setError(err.response.data.message || 'Booking failed.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Book a Court</h3>
            <label>Select Time Slot:</label>
            <input
                type="datetime-local"
                value={bookingStartTime}
                onChange={(e) => setBookingStartTime(e.target.value)}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">Confirm and Book</button>
        </form>
    );
};

export default BookingForm;