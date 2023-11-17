from flask import Flask, request, jsonify
import json
import os

app = Flask(__name__)

DATA_FILE = 'data.json'

def read_data():
    if not os.path.exists(DATA_FILE):
        return {
            "users": [],
            "transactions": [],
            "recurring_expenses": [],
            "notifications": [],
            "debts": [],
            "investments": [],
            "budgets": [],
            "savings_goals": [],
            "currencies": [],
            "user_settings": [],
            "categories": [],
            "groups": [],
            "group_balances": [],
            "expenses": [],
            "group_expenses": []
        }
    with open(DATA_FILE, 'r') as file:
        return json.load(file)

def write_data(data):
    with open(DATA_FILE, 'w') as file:
        json.dump(data, file, indent=4)

# user management
# Route to register a new user
@app.route('/users', methods=['POST'])
def create_user():
    user_data = request.json
    data = read_data()
    data['users'].append(user_data)  # Add the new user to the 'users' list
    write_data(data)  # Write the updated data back to the file
    return jsonify(user_data), 201
# Route to update an existing user
@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user_data = request.json
    data = read_data()
    user_index = next((index for index, user in enumerate(data['users']) if user['user_id'] == user_id), None)
    if user_index is not None:
        data['users'][user_index] = user_data
        write_data(data)
        return jsonify(user_data), 200
    else:
        return jsonify({"error": "User not found"}), 404
    # Route to delete a user
@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    data = read_data()
    user_index = next((index for index, user in enumerate(data['users']) if user['user_id'] == user_id), None)
    if user_index is not None:
        deleted_user = data['users'].pop(user_index)
        write_data(data)
        return jsonify(deleted_user), 200
    else:
        return jsonify({"error": "User not found"}), 404
    
#Transaction module
# Route to create a new transaction
@app.route('/transactions', methods=['POST'])
def create_transaction():
    transaction_data = request.json
    data = read_data()
    data['transactions'].append(transaction_data)  # Add the new transaction to the 'transactions' list
    write_data(data)  # Write the updated data back to the file
    return jsonify(transaction_data), 201

# Route to update an existing transaction
@app.route('/transactions/<int:transaction_id>', methods=['PUT'])
def update_transaction(transaction_id):
    transaction_data = request.json
    data = read_data()
    transaction_index = next((index for index, transaction in enumerate(data['transactions']) if transaction['transaction_id'] == transaction_id), None)
    if transaction_index is not None:
        data['transactions'][transaction_index] = transaction_data
        write_data(data)
        return jsonify(transaction_data), 200
    else:
        return jsonify({"error": "Transaction not found"}), 404

# Route to delete a transaction
@app.route('/transactions/<int:transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id):
    data = read_data()
    transaction_index = next((index for index, transaction in enumerate(data['transactions']) if transaction['transaction_id'] == transaction_id), None)
    if transaction_index is not None:
        deleted_transaction = data['transactions'].pop(transaction_index)
        write_data(data)
        return jsonify(deleted_transaction), 200
    else:
        return jsonify({"error": "Transaction not found"}), 404
    

# Create a new recurring expense
@app.route('/recurring_expenses', methods=['POST'], endpoint='create_recurring_expense_endpoint')
def create_recurring_expense():
    recurring_expense_data = request.json
    data = read_data()
    data['recurring_expenses'].append(recurring_expense_data)
    write_data(data)
    return jsonify(recurring_expense_data), 201

# Update an existing recurring expense
@app.route('/recurring_expenses/<int:expense_id>', methods=['PUT'])
def update_recurring_expense(expense_id):
    recurring_expense_data = request.json
    data = read_data()
    expense_index = next((index for index, expense in enumerate(data['recurring_expenses']) if expense['expense_id'] == expense_id), None)
    if expense_index is not None:
        data['recurring_expenses'][expense_index] = recurring_expense_data
        write_data(data)
        return jsonify(recurring_expense_data), 200
    else:
        return jsonify({"error": "Recurring expense not found"}), 404

#Notification module
# Route to send an immediate notification
@app.route('/notifications', methods=['POST'])
def send_notification():
    notification_data = request.json
    data = read_data()
    data['notifications'].append(notification_data)  # Add the new notification to the 'notifications' list
    write_data(data)  # Write the updated data back to the file
    return jsonify(notification_data), 201

# Route to schedule a notification for later
@app.route('/notifications/schedule', methods=['POST'])
def schedule_notification():
    notification_data = request.json
    data = read_data()
    data['notifications'].append(notification_data)  # Add the scheduled notification to the 'notifications' list
    write_data(data)  # Write the updated data back to the file
    return jsonify(notification_data), 201

#User Setting Moduel
# Route to update user settings
@app.route('/user_settings/<int:user_id>', methods=['PUT'])
def update_user_settings(user_id):
    settings_data = request.json
    data = read_data()
    user_index = next((index for index, user in enumerate(data['users']) if user['user_id'] == user_id), None)
    if user_index is not None:
        data['user_settings'].append({
            "user_id": user_id,
            "settings_data": settings_data
        })
        write_data(data)
        return jsonify({"user_id": user_id, "settings_data": settings_data}), 200
    else:
        return jsonify({"error": "User not found"}), 404

# Route to load user settings
@app.route('/user_settings/<int:user_id>', methods=['GET'])
def load_user_settings(user_id):
    data = read_data()
    user_settings = next((settings for settings in data['user_settings'] if settings['user_id'] == user_id), None)
    if user_settings is not None:
        return jsonify(user_settings), 200
    else:
        return jsonify({"error": "User settings not found"}), 404

#Splitting expense Module
# Route to split expenses with specified amounts among group members
@app.route('/groups/<int:group_id>/split_expenses', methods=['POST'])
def split_expenses(group_id):
    expense_data = request.json
    data = read_data()
    group = next((g for g in data['groups'] if g['group_id'] == group_id), None)
    if group:
        # Check if the specified members exist in the group
        specified_members = expense_data.get('members', [])
        for member_id in specified_members:
            if not any(member['user_id'] == member_id for member in group['members']):
                return jsonify({"error": "Invalid member(s) specified"}), 400

        # Split expenses among specified members
        split_expenses = [{"user_id": member_id, "amount": expense_data['amount_per_member']} for member_id in specified_members]
        return jsonify({'split_expenses': split_expenses}), 200
    else:
        return jsonify({"error": "Group not found"}), 404


# Starting the Flask app
if __name__ == '__main__':
    app.run(debug=True)