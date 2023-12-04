from flask import Flask, session, flash, redirect, url_for, request, render_template, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import json
import os

app = Flask(__name__, static_folder='../Frontend/static', template_folder='../Frontend/templates')
app.secret_key = 'your_secret_key'

@app.route('/')
def home():
    return render_template('index.html')
@app.route('/login')
def login_page():
    return render_template('login.html')

@app.route('/register')
def register_page():
    return render_template('register.html')

@app.route('/add_investment')
def add_investment():
    return render_template('add_investment.html')

@app.route('/add_debt')
def add_debt():
    # Ensure the user is logged in before allowing them to add a debt
    if 'user_id' not in session:
        return redirect(url_for('login_page'))
    return render_template('debts.html')

@app.route('/add_budget')
def add_budget():
    return render_template('budgets.html')

@app.route('/add_transaction')
def add_transaction():
    # Ensure the user is logged in before allowing them to add a transaction
    if 'user_id' not in session:
        return redirect(url_for('login_page'))
    return render_template('transactions.html')

@app.route('/add_expense')
def add_expense():
    # Your logic here
    return render_template('add_expense.html')

@app.route('/add_savings_goal')
def add_savings_goal():
    # Ensure the user is logged in before allowing them to add a savings goal
    if 'user_id' not in session:
        return redirect(url_for('login_page'))
    return render_template('savings_goals.html')


@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login_page'))
    

    data = read_data()

    # Assuming 'user_id' in session is an int
    user_id = session['user_id']

    # Finding the logged-in user's data
    user_data = next((user for user in data['users'] if user['user_id'] == user_id), None)
    if not user_data:
        return jsonify({"message": "User not found"}), 404

    # Collecting all related data for the user
    user_transactions = [t for t in data['transactions'] if t['user_id'] == user_id]
    user_recurring_expenses = [re for re in data['recurring_expenses'] if re['user_id'] == user_id]
    # ... continue collecting data as per your existing code ...

    # Constructing the dashboard data
    dashboard_data = {
        "user_info": user_data,  # assuming user_data contains all necessary user info
        "transactions": user_transactions,
        # ... include other data modules as necessary ...
    }

    return render_template('dashboard.html', dashboard_data=dashboard_data)


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
    user_data['password_hash'] = generate_password_hash(user_data['password'])
    del user_data['password']  # Remove the plain password from the data

    data = read_data()
    user_data['user_id'] = len(data['users']) + 1  # Assign a new user ID
    data['users'].append(user_data)  # Add the new user to the 'users' list
    write_data(data)  # Write the updated data back to the file
    return jsonify(user_data), 201


@app.route('/login', methods=['POST'])
def login():
    credentials = request.json
    username = credentials['username']
    password = credentials['password']
    data = read_data()

    user = next((u for u in data['users'] if u['username'] == username), None)
    if user and check_password_hash(user['password_hash'], password):
        session['user_id'] = user['user_id']
        return jsonify({"message": "Login successful", "user_id": user['user_id']}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({"message": "Logged out"}), 200


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

# Category module
# Route to add a new category
@app.route('/categories', methods=['POST'])
def create_category():
    category_data = request.json
    data = read_data()
    data['categories'].append(category_data)
    write_data(data)
    return jsonify(category_data), 201

# Route to update an existing category
@app.route('/categories/<int:category_id>', methods=['PUT'])
def update_category(category_id):
    category_data = request.json
    data = read_data()
    category_index = next((index for index, category in enumerate(data['categories']) if category['category_id'] == category_id), None)
    if category_index is not None:
        data['categories'][category_index] = category_data
        write_data(data)
        return jsonify(category_data), 200
    else:
        return jsonify({"error": "Category not found"}), 404

# Route to delete a category
@app.route('/categories/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    data = read_data()
    category_index = next((index for index, category in enumerate(data['categories']) if category['category_id'] == category_id), None)
    if category_index is not None:
        deleted_category = data['categories'].pop(category_index)
        write_data(data)
        return jsonify(deleted_category), 200
    else:
        return jsonify({"error": "Category not found"}), 404

#Debt module
# Route to add a new debt
@app.route('/debts', methods=['POST'])
def create_debt():
    debt_data = request.json
    data = read_data()
    data['debts'].append(debt_data)
    write_data(data)
    return jsonify(debt_data), 201

# Route to update an existing debt
@app.route('/debts/<int:debt_id>', methods=['PUT'])
def update_debt(debt_id):
    debt_data = request.json
    data = read_data()
    debt_index = next((index for index, debt in enumerate(data['debts']) if debt['debt_id'] == debt_id), None)
    if debt_index is not None:
        data['debts'][debt_index] = debt_data
        write_data(data)
        return jsonify(debt_data), 200
    else:
        return jsonify({"error": "Debt not found"}), 404

# Route to delete a debt
@app.route('/debts/<int:debt_id>', methods=['DELETE'])
def delete_debt(debt_id):
    data = read_data()
    debt_index = next((index for index, debt in enumerate(data['debts']) if debt['debt_id'] == debt_id), None)
    if debt_index is not None:
        deleted_debt = data['debts'].pop(debt_index)
        write_data(data)
        return jsonify(deleted_debt), 200
    else:
        return jsonify({"error": "Debt not found"}), 404
#Investment Module
# Route to add a new investment
@app.route('/investments', methods=['POST'])
def create_investment():
    investment_data = request.json
    data = read_data()
    data['investments'].append(investment_data)
    write_data(data)
    return jsonify(investment_data), 201

# Route to update an existing investment
@app.route('/investments/<int:investment_id>', methods=['PUT'])
def update_investment(investment_id):
    investment_data = request.json
    data = read_data()
    investment_index = next((index for index, investment in enumerate(data['investments']) if investment['investment_id'] == investment_id), None)
    if investment_index is not None:
        data['investments'][investment_index] = investment_data
        write_data(data)
        return jsonify(investment_data), 200
    else:
        return jsonify({"error": "Investment not found"}), 404

# Route to delete an investment
@app.route('/investments/<int:investment_id>', methods=['DELETE'])
def delete_investment(investment_id):
    data = read_data()
    investment_index = next((index for index, investment in enumerate(data['investments']) if investment['investment_id'] == investment_id), None)
    if investment_index is not None:
        deleted_investment = data['investments'].pop(investment_index)
        write_data(data)
        return jsonify(deleted_investment), 200
    else:
        return jsonify({"error": "Investment not found"}), 404

#Budgets Module
# Route to add a new budget
@app.route('/budgets', methods=['POST'])
def create_budget():
    budget_data = request.json
    data = read_data()
    data['budgets'].append(budget_data)
    write_data(data)
    return jsonify(budget_data), 201

# Route to update an existing budget
@app.route('/budgets/<int:budget_id>', methods=['PUT'])
def update_budget(budget_id):
    budget_data = request.json
    data = read_data()
    budget_index = next((index for index, budget in enumerate(data['budgets']) if budget['budget_id'] == budget_id), None)
    if budget_index is not None:
        data['budgets'][budget_index] = budget_data
        write_data(data)
        return jsonify(budget_data), 200
    else:
        return jsonify({"error": "Budget not found"}), 404

# Route to delete a budget
@app.route('/budgets/<int:budget_id>', methods=['DELETE'])
def delete_budget(budget_id):
    data = read_data()
    budget_index = next((index for index, budget in enumerate(data['budgets']) if budget['budget_id'] == budget_id), None)
    if budget_index is not None:
        deleted_budget = data['budgets'].pop(budget_index)
        write_data(data)
        return jsonify(deleted_budget), 200
    else:
        return jsonify({"error": "Budget not found"}), 404

#Expense Tracking Module
@app.route('/expenses', methods=['POST'])
def create_expense():
    # Ensure the user is logged in before allowing them to add an expense
    if 'user_id' not in session:
        return jsonify({"message": "Unauthorized access. Please log in."}), 401

    try:
        expense_data = request.json
        data = read_data()

        # Ensure the expense data contains all the necessary fields
        if not all(key in expense_data for key in ['amount', 'description', 'expense_date']):
            return jsonify({"message": "Missing data for expense."}), 400

        # Add user ID from the session to the expense data
        expense_data['user_id'] = session['user_id']
        
        # Append the new expense to the 'expenses' list
        data['expenses'].append(expense_data)
        
        # Write the updated data back to the file
        write_data(data)

        return jsonify(expense_data), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 500
# Route to update an existing expense
@app.route('/expenses/<int:expense_id>', methods=['PUT'])
def update_expense(expense_id):
    expense_data = request.json
    data = read_data()
    expense_index = next((index for index, expense in enumerate(data['expenses']) if expense['expense_id'] == expense_id), None)
    if expense_index is not None:
        data['expenses'][expense_index] = expense_data
        write_data(data)
        return jsonify(expense_data), 200
    else:
        return jsonify({"error": "Expense not found"}), 404

# Route to delete an expense
@app.route('/expenses/<int:expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    data = read_data()
    expense_index = next((index for index, expense in enumerate(data['expenses']) if expense['expense_id'] == expense_id), None)
    if expense_index is not None:
        deleted_expense = data['expenses'].pop(expense_index)
        write_data(data)
        return jsonify(deleted_expense), 200
    else:
        return jsonify({"error": "Expense not found"}), 404

#Savings Goal Module 
# Route to add a new savings goal
@app.route('/savings_goals', methods=['POST'])
def create_savings_goal():
    savings_goal_data = request.json
    data = read_data()
    data['savings_goals'].append(savings_goal_data)
    write_data(data)
    return jsonify(savings_goal_data), 201

# Route to update an existing savings goal
@app.route('/savings_goals/<int:goal_id>', methods=['PUT'])
def update_savings_goal(goal_id):
    savings_goal_data = request.json
    data = read_data()
    goal_index = next((index for index, goal in enumerate(data['savings_goals']) if goal['goal_id'] == goal_id), None)
    if goal_index is not None:
        data['savings_goals'][goal_index] = savings_goal_data
        write_data(data)
        return jsonify(savings_goal_data), 200
    else:
        return jsonify({"error": "Savings goal not found"}), 404

# Route to delete a savings goal
@app.route('/savings_goals/<int:goal_id>', methods=['DELETE'])
def delete_savings_goal(goal_id):
    data = read_data()
    goal_index = next((index for index, goal in enumerate(data['savings_goals']) if goal['goal_id'] == goal_id), None)
    if goal_index is not None:
        deleted_goal = data['savings_goals'].pop(goal_index)
        write_data(data)
        return jsonify(deleted_goal), 200
    else:
        return jsonify({"error": "Savings goal not found"}), 404

#Currency Module
# Route to add a new currency
@app.route('/currencies', methods=['POST'])
def create_currency():
    currency_data = request.json
    data = read_data()
    data['currencies'].append(currency_data)
    write_data(data)
    return jsonify(currency_data), 201

# Route to update an existing currency
@app.route('/currencies/<int:currency_id>', methods=['PUT'])
def update_currency(currency_id):
    currency_data = request.json
    data = read_data()
    currency_index = next((index for index, currency in enumerate(data['currencies']) if currency['currency_id'] == currency_id), None)
    if currency_index is not None:
        data['currencies'][currency_index] = currency_data
        write_data(data)
        return jsonify(currency_data), 200
    else:
        return jsonify({"error": "Currency not found"}), 404

# Route to delete a currency
@app.route('/currencies/<int:currency_id>', methods=['DELETE'])
def delete_currency(currency_id):
    data = read_data()
    currency_index = next((index for index, currency in enumerate(data['currencies']) if currency['currency_id'] == currency_id), None)
    if currency_index is not None:
        deleted_currency = data['currencies'].pop(currency_index)
        write_data(data)
        return jsonify(deleted_currency), 200
    else:
        return jsonify({"error": "Currency not found"}), 404


#Report Module
# Route to generate a comprehensive financial report
@app.route('/reports/comprehensive', methods=['GET'])
def generate_comprehensive_report():
    data = read_data()

    report = {
        "total_users": len(data['users']),
        "total_transactions": sum(t['amount'] for t in data['transactions']),
        "total_debts": sum(d['amount'] for d in data['debts']),
        "total_investments": sum(i['amount'] for i in data['investments']),
        "total_budgets": sum(b['amount'] for b in data['budgets']),
        "total_expenses": sum(e['amount'] for e in data['expenses']),
        "savings_goals_reached": sum(1 for g in data['savings_goals'] if g['current_amount'] >= g['target_amount']),
        "category_wise_expenses": {}
    }

    # Categorizing expenses
    for expense in data['expenses']:
        category_id = expense['category_id']
        category_name = next((c['name'] for c in data['categories'] if c['category_id'] == category_id), "Unknown")
        if category_name not in report['category_wise_expenses']:
            report['category_wise_expenses'][category_name] = 0
        report['category_wise_expenses'][category_name] += expense['amount']

    return jsonify(report), 200

# Starting the Flask app
if __name__ == '__main__':
    app.run(debug=True)