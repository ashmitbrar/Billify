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

#route to create a new transaction 
@app.route('/transactions', methods=['POST'])
def create_transaction():
    connection = create_db_connection()
    cursor = connection.cursor()
    
    user_id = request.json['user_id']
    amount = request.json['amount']
    description = request.json['description']
    
    query = """
    INSERT INTO transactions (user_id, amount, description) 
    VALUES (%s, %s, %s)
    """
    cursor.execute(query, (user_id, amount, description))
    
    connection.commit()
    transaction_id = cursor.lastrowid
    
    cursor.close()
    connection.close()
    
    return jsonify({"transaction_id": transaction_id}), 201

# Route to get transactions for a user
@app.route('/transactions/<int:user_id>', methods=['GET'])
def get_transactions_for_user(user_id):
    connection = create_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    query = "SELECT * FROM transactions WHERE user_id = %s"
    cursor.execute(query, (user_id,))
    
    transactions = cursor.fetchall()
    
    cursor.close()
    connection.close()
    
    return jsonify(transactions)

# Route to create a new recurring expense
@app.route('/recurring_expenses', methods=['POST'])
def create_recurring_expense():
    connection = create_db_connection()
    cursor = connection.cursor()
    
    user_id = request.json['user_id']
    amount = request.json['amount']
    description = request.json['description']
    next_occurrence = request.json['next_occurrence']
    interval_days = request.json.get('interval_days', 30)  # Default to 30 days if not provided
    
    query = """
    INSERT INTO recurring_expenses (user_id, amount, description, next_occurrence, interval_days) 
    VALUES (%s, %s, %s, %s, %s)
    """
    cursor.execute(query, (user_id, amount, description, next_occurrence, interval_days))
    
    connection.commit()
    expense_id = cursor.lastrowid
    
    cursor.close()
    connection.close()
    
    return jsonify({"expense_id": expense_id}), 201

# Route to get all recurring expenses for a user
@app.route('/recurring_expenses/user/<int:user_id>', methods=['GET'])
def get_recurring_expenses_for_user(user_id):
    connection = create_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    query = "SELECT * FROM recurring_expenses WHERE user_id = %s"
    cursor.execute(query, (user_id,))
    
    recurring_expenses = cursor.fetchall()
    
    cursor.close()
    connection.close()
    
    return jsonify(recurring_expenses)

# Starting the Flask app
if __name__ == '__main__':
    app.run(debug=True)

