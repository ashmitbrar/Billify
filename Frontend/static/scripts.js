<script src="script.js"></script>

// scripts.js

// Remember to define the showMessage function at the top of your scripts.js
function showMessage(message, isSuccess = true) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.style.color = isSuccess ? 'green' : 'red';
    messageDiv.style.display = 'block';

    // Hide the message after 5 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}
// Function to handle user login
function handleLogin(username, password) {
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Login successful") {
            // You might want to store user_id in session storage or a cookie
            // sessionStorage.setItem('user_id', data.user_id);
            window.location.href = '/dashboard.html'; // Redirect to dashboard
        } else {
            showMessage(data.message, false);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('Login failed.', false);
    });
}
// Function to handle user logout
function handleLogout() {
    fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        showMessage(data.message);
        // Clear session storage or cookies if used
        // sessionStorage.clear();
        window.location.href = '/login.html'; // Redirect to login page
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('Logout failed.', false);
    });
}
document.addEventListener('DOMContentLoaded', function() {

    // Event listener for the login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            handleLogin(username, password);
        });
    }

    // Event listener for the logout button
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            handleLogout();
        });
    }


    // Event listener for the registration form
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        const data = { username, email, password }; // Adjust according to your backend expectations
        
        fetch('/users', { // Ensure this URL matches your Flask route
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            showMessage('User registered successfully!');
        })
        .catch((error) => {
            console.error('Error:', error);
            showMessage('Failed to register user.', false);
        });
    });

    // Event listener for the transaction form
    document.getElementById('transactionForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const userId = document.getElementById('userId').value;
        const amount = document.getElementById('amount').value;
        const description = document.getElementById('description').value;
        
        const data = { userId, amount, description }; // Adjust according to your backend expectations
        
        fetch('/transactions', { // Ensure this URL matches your Flask route
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            showMessage('Transaction added successfully!');
        })
        .catch((error) => {
            console.error('Error:', error);
            showMessage('Failed to add transaction.', false);
        });
    });

});

// Event listener for the recurring expense form
document.getElementById('recurringExpenseForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Collect data from form fields
    const userId = document.getElementById('userIdExpense').value;
    const amount = document.getElementById('expenseAmount').value;
    const description = document.getElementById('expenseDescription').value;
    const nextOccurrence = document.getElementById('nextOccurrence').value;

    // Prepare data to send in the request body
    const data = { userId, amount, description, next_occurrence: nextOccurrence };
    
    // Perform the POST request to the recurring expenses route
    fetch('/recurring_expenses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        showMessage('Recurring expense added successfully!');
    })
    .catch((error) => {
        console.error('Error:', error);
        showMessage('Failed to add recurring expense.', false);
    });
});
// Event listener for the notification form
document.getElementById('notificationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Collect data from form fields
    const userId = document.getElementById('userIdNotification').value;
    const message = document.getElementById('message').value;
    const scheduledTime = document.getElementById('scheduledTime').value;

    // Prepare data to send in the request body
    const data = { userId, message, scheduled_time: scheduledTime };
    
    // Perform the POST request to the notifications route
    fetch('/notifications', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        showMessage('Notification scheduled successfully!');
    })
    .catch((error) => {
        console.error('Error:', error);
        showMessage('Failed to schedule notification.', false);
    });
});

// Event listener for the category form
document.getElementById('categoryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Collect data from form fields
    const name = document.getElementById('categoryName').value;

    // Prepare data to send in the request body
    const data = { name };
    
    // Perform the POST request to the categories route
    fetch('/categories', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        showMessage('Category added successfully!');
    })
    .catch((error) => {
        console.error('Error:', error);
        showMessage('Failed to add category.', false);
    });
});
// User Settings Update
document.getElementById('userSettingsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const userId = document.getElementById('userIdSettings').value;
    const settingsData = document.getElementById('settingsData').value;

    const data = { settings_data: JSON.parse(settingsData) };

    fetch(`/user_settings/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        showMessage('User settings updated successfully!');
    })
    .catch((error) => {
        console.error('Error:', error);
        showMessage('Failed to update user settings.', false);
    });
});

// Investments Management
document.getElementById('addInvestmentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const userId = document.getElementById('userIdInvestment').value;
    const amount = document.getElementById('investmentAmount').value;
    const description = document.getElementById('investmentDescription').value;
    const returnRate = document.getElementById('returnRate').value;

    const data = {
        user_id: userId,
        amount,
        description,
        return_rate: returnRate
    };

    fetch('/investments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        showMessage('Investment added successfully!');
    })
    .catch((error) => {
        console.error('Error:', error);
        showMessage('Failed to add investment.', false);
    });
});

// Debt Records Handling
document.getElementById('addDebtForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const userId = document.getElementById('userIdDebt').value;
    const amount = document.getElementById('debtAmount').value;
    const description = document.getElementById('debtDescription').value;
    const dueDate = document.getElementById('dueDate').value;

    const data = {
        user_id: userId,
        amount,
        description,
        due_date: dueDate
    };

    fetch('/debts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        showMessage('Debt added successfully!');
    })
    .catch((error) => {
        console.error('Error:', error);
        showMessage('Failed to add debt.', false);
    });
});

// Function to show messages on the page
function showMessage(message, success = true) {
    // You can implement this function to display success or error messages on your page
    console.log(message); // Placeholder for actual implementation
}
// Budgets Management
document.getElementById('budgetForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const userId = document.getElementById('userIdBudget').value;
    const amount = document.getElementById('budgetAmount').value;
    const startDate = document.getElementById('budgetStartDate').value;
    const endDate = document.getElementById('budgetEndDate').value;
    const description = document.getElementById('budgetDescription').value;

    const data = {
        user_id: userId,
        amount,
        start_date: startDate,
        end_date: endDate,
        description
    };

    fetch('/budgets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        showMessage('Budget created successfully!');
    })
    .catch((error) => {
        console.error('Error:', error);
        showMessage('Failed to create budget.', false);
    });
});

// Transactions Recording
document.getElementById('transactionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const userId = document.getElementById('userIdTransaction').value;
    const amount = document.getElementById('transactionAmount').value;
    const description = document.getElementById('transactionDescription').value;
    const transactionDate = document.getElementById('transactionDate').value;

    const data = {
        user_id: userId,
        amount,
        description,
        transaction_date: transactionDate
    };

    fetch('/transactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        showMessage('Transaction recorded successfully!');
    })
    .catch((error) => {
        console.error('Error:', error);
        showMessage('Failed to record transaction.', false);
    });
});

// Savings Goals Management
document.getElementById('addSavingsGoalForm').addEventListener('submit', function(e) { // Make sure this ID matches the form ID in your HTML
    e.preventDefault();
    const userId = document.getElementById('userIdSavingsGoal').value; // Ensure these IDs exist in your form
    const targetAmount = document.getElementById('targetAmount').value;
    const currentAmount = document.getElementById('currentAmount').value;
    const description = document.getElementById('savingsGoalDescription').value;
    const targetDate = document.getElementById('targetDate').value;

    const data = {
        user_id: userId,
        target_amount: targetAmount,
        current_amount: currentAmount,
        description,
        target_date: targetDate
    };

    fetch('/savings_goals', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        showMessage('Savings goal added successfully!');
    })
    .catch((error) => {
        console.error('Error:', error);
        showMessage('Failed to add savings goal.', false);
    });
});