from flask import Flask, request, jsonify
import mysql2.connector
from mysql2.connector import Error

app = Flask(__name__)

# Database configuration

db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Bobby_2012',
    'database': 'billify'
}

# Establish a database connection
def create_db_connection():
    connection = None
    try:
        connection = mysql2.connector.connect(**db_config)
    except Error as e:
        print(f"The error '{e}' occurred")
    return connection

# Route to register a new user
@app.route('/users', methods=['POST'])
def create_user():
    connection = create_db_connection()
    cursor = connection.cursor()
    
    username = request.json['username']
    email = request.json['email']
    password_hash = request.json['password_hash']
    total_money = request.json.get('total_money', 0.00)  # Default to 0.00 if not provided
    
    query = """
    INSERT INTO users (username, email, password_hash, total_money) 
    VALUES (%s, %s, %s, %s)
    """
    cursor.execute(query, (username, email, password_hash, total_money))
    
    connection.commit()
    user_id = cursor.lastrowid
    
    cursor.close()
    connection.close()
    
    return jsonify({"user_id": user_id}), 201

# Starting the Flask app
if __name__ == '__main__':
    app.run(debug=True)

