from flask import Flask, request, jsonify
import pandas as pd
import mysql.connector

app = Flask(__name__)

def get_db_connection():
    # IMPORTANT: Use environment variables for credentials in a real app
    conn = mysql.connector.connect(
        host='localhost',
        user='your_mysql_user',
        password='your_mysql_password',
        database='quickcourt_db'
    )
    return conn

@app.route('/analyze/peak-hours', methods=['POST'])
def analyze_peak_hours():
    facility_id = request.json['facilityId']
    
    conn = get_db_connection()
    # Query to get all bookings for a facility's courts
    query = """
    SELECT b.bookingStartTime 
    FROM bookings b
    JOIN courts c ON b.courtId = c.id
    WHERE c.facilityId = %s
    """
    
    # Use pandas to read SQL and analyze
    df = pd.read_sql(query, conn, params=[facility_id])
    conn.close()
    
    if df.empty:
        return jsonify({"message": "No booking data found."})
    
    df['hour'] = pd.to_datetime(df['bookingStartTime']).dt.hour
    peak_hours = df['hour'].value_counts().nlargest(3).to_dict() # Get top 3 hours
    
    # [cite_start]This data can be used for the Peak Booking Hours chart [cite: 71]
    return jsonify(peak_hours)

if __name__ == '__main__':
    app.run(port=5001, debug=True)