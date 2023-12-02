
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
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.message === "Login successful") {
            showMessage('Login successful! Redirecting...');
            setTimeout(() => {
                window.location.href = '/dashboard'; // Redirect to dashboard after a short delay
            }, 1000);
        } else {
            showMessage(data.message, false);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('Login failed.', false);
    });
}
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
    logoutButton.addEventListener('click', handleLogout);
}



    // Event listener for the registration form
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value; // This captures the email from the form
    const password = document.getElementById('registerPassword').value;
        
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
            showMessage('User registered successfully! Redirecting...');
            setTimeout(() => {
                window.location.href = '/dashboard'; // Redirect to dashboard after a short delay
            }, 1000);
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
document.getElementById('accountBtn').addEventListener('click', function() {
    // Fetch and display user settings and notifications
    fetchUserSettings();
    fetchNotifications();
});

function fetchUserSettings() {
    // Assuming 'userId' is stored in session storage or a global variable
    fetch(`/user_settings/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('User settings:', data);
        // Code to display user settings goes here
    })
    .catch(error => {
        console.error('Failed to fetch user settings:', error);
    });
}

function fetchNotifications() {
    // Assuming 'userId' is stored in session storage or a global variable
    fetch(`/notifications/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(notifications => {
        console.log('Notifications:', notifications);
        displayNotifications(notifications);
    })
    .catch(error => {
        console.error('Failed to fetch notifications:', error);
    });
}

function displayNotifications(notifications) {
    // Assuming you have a div or some container to display notifications
    const notificationsContainer = document.getElementById('notificationsContainer');
    notificationsContainer.innerHTML = '';

    notifications.forEach(notification => {
        const notificationElement = document.createElement('div');
        notificationElement.classList.add('notification');
        notificationElement.textContent = notification.message;
        // Add more details if needed
        notificationsContainer.appendChild(notificationElement);
    });
}

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
    var userId = sessionStorage.getItem('userId');

    const investmentData = {
        user_id: userId,
        amount: document.getElementById('investmentAmount').value,
        description: document.getElementById('investmentDescription').value,
        return_rate: document.getElementById('returnRate').value
    };
   

    fetch('/investments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(investmentData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Investment added:', data);
        showMessage('Investment added successfully!');
        // Optionally, redirect to the dashboard or clear the form
        window.location.href = '/dashboard';
         e.target.reset();
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