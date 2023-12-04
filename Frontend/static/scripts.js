
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
            // Store the userId in sessionStorage
        sessionStorage.setItem('userId', data.user_id);
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
        sessionStorage.removeItem('userId');
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
    var loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            handleLogin(username, password);
        });
    }

   // Event listener for the logout button
var logoutButton = document.getElementById('logoutButton');
if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout);
}

    // Event listener for the registration form
    document.addEventListener('DOMContentLoaded', function() {
        var registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', function(e) {
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
        
}
    });
    // Event listener for the transaction form
    var transactionForm = document.getElementById('transactionForm');
    if (transactionForm) {
        transactionForm.addEventListener('submit', function(e) {
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
    }
});


// Event listener for the recurring expense form
var recurringExpenseForm = document.getElementById('recurringExpenseForm');
if (recurringExpenseForm) {
    recurringExpenseForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // Collect data from form fields
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        showMessage('Not logged in. Redirecting to login page...', false);
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 1000);
        return; // Exit the function if no userId is found
    }
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
}
document.addEventListener('DOMContentLoaded', function() {
    var accountBtn = document.getElementById('accountBtn');
    if (accountBtn) {
        accountBtn.addEventListener('click', function() {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        showMessage('Not logged in. Redirecting to login page...', false);
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 1000);
        return; // Exit the function if no userId is found
    }
    // Fetch and display user settings and notifications
    fetchUserSettings();
    fetchNotifications();
});
    }
});

function fetchUserSettings() {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        showMessage('Not logged in. Redirecting to login page...', false);
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 1000);
        return; // Exit the function if no userId is found
    }
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
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        showMessage('Not logged in. Redirecting to login page...', false);
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 1000);
        return; // Exit the function if no userId is found
    }
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
// document.addEventListener('DOMContentLoaded', function() {
    var categoryForm = document.getElementById('categoryForm');
    if (categoryForm) {
        categoryForm.addEventListener('submit', function(e) {
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
    }
// });
// User Settings Update
var userSettingsForm = document.getElementById('userSettingsForm');
    if (userSettingsForm) {
        userSettingsForm.addEventListener('submit', function(e) {
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
    }
// Investments Management
var addInvestmentForm = document.getElementById('addInvestmentForm');
if (addInvestmentForm) {
    addInvestmentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var userId = sessionStorage.getItem('userId');
if (!userId) {
    showMessage('Not logged in. Redirecting to login page...', false);
    setTimeout(() => {
        window.location.href = '/login.html';
    }, 1000);
    return; // Exit the function if no userId is found
}


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
        setTimeout(() => {
            window.location.reload(); // This will reload the page after the message is shown for the duration set in showMessage.
        }, 5000);
    })
    .catch((error) => {
        console.error('Error:', error);
        showMessage('Failed to add investment.', false);
    });
});
}
// Function to show messages on the page
function showMessage(message, isSuccess = true) {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.style.display = 'block';
        messageDiv.style.color = isSuccess ? 'green' : 'red';
    
        // Hide the message after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    } else {
        alert(message); // Fallback to alert if message div is not found
    }
}

document.addEventListener('DOMContentLoaded', function() {
// Debt Records Handling
var addDebtForm = document.getElementById('addDebtForm');
    if (addDebtForm) {
        addDebtForm.addEventListener('submit', function(e) {
            e.preventDefault();
    const userId = sessionStorage.getItem('userId');
if (!userId) {
    showMessage('Not logged in. Redirecting to login page...', false);
    setTimeout(() => {
        window.location.href = '/login.html';
    }, 1000);
    return; // Exit the function if no userId is found
}
// Collect data from the form fields
const formData = {
    name: document.getElementById('debtName').value,
    amount: parseFloat(document.getElementById('debtAmount').value),
    due_date: document.getElementById('dueDate').value,
    description: document.getElementById('debtDescription').value
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
        showMessage('Debt added successfully!', true);
        // Redirect or update the page as needed
        setTimeout(() => {
            window.location.href = '/dashboard'; // Redirect to dashboard after showing message
        }, 2000);
    })
    .catch((error) => {
        console.error('Error:', error);
        showMessage('Failed to add debt.', false);
    });
});
    }
});
// Function to show messages on the page
function showMessage(message, success = true) {
    // You can implement this function to display success or error messages on your page
    console.log(message); // Placeholder for actual implementation
}
// Budgets Management
document.addEventListener('DOMContentLoaded', function() {
var budgetForm = document.getElementById('budgetForm');
    if (budgetForm) {
        budgetForm.addEventListener('submit', function(e) {
            e.preventDefault();
    const userId = sessionStorage.getItem('userId');
if (!userId) {
    showMessage('Not logged in. Redirecting to login page...', false);
    setTimeout(() => {
        window.location.href = '/login.html';
    }, 1000);
    return; // Exit the function if no userId is found
}
const formData = {
    name: document.getElementById('budgetName').value,
    amount: parseFloat(document.getElementById('budgetAmount').value),
    start_date: document.getElementById('startDate').value,
    end_date: document.getElementById('endDate').value,
    description: document.getElementById('budgetDescription').value
    
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
        alert('Budget created successfully!');
        window.location.href = '/dashboard';
    })
    .catch((error) => {
        console.error('Error:', error);
        showMessage('Failed to create budget.', false);
    });
});
    }
    });
    
// Transactions Recording
document.addEventListener('DOMContentLoaded', function() {
    var transactionForm = document.getElementById('transactionForm');
    if (transactionForm) {
        transactionForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // Make sure these IDs match the input fields in your form
    const transactionName = document.getElementById('transactionName').value;
    const transactionAmount = document.getElementById('transactionAmount').value;
    const transactionDate = document.getElementById('transactionDate').value;
    const transactionDescription = document.getElementById('transactionDescription').value;

    // Assuming you are storing userId in sessionStorage when the user logs in
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
        showMessage('Not logged in. Redirecting to login page...', false);
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 1000);
        return; // Exit the function if no userId is found
    }

    const data = {
        user_id: userId,
        name: transactionName,
        amount: parseFloat(transactionAmount),
        transaction_date: transactionDate,
        description: transactionDescription
    };

    fetch('/transactions', {
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
}
});

// Function to handle adding a savings goal
function handleAddSavingsGoal(savingsGoalData) {
    fetch('/savings_goals', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(savingsGoalData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        showMessage('Savings goal added successfully!');
        setTimeout(() => {
            window.location.href = '/dashboard'; // Redirect to dashboard
        }, 2000);
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('Failed to add savings goal.', false);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    var addSavingsGoalForm = document.getElementById('addSavingsGoalForm');
    if (addSavingsGoalForm) {
        addSavingsGoalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const targetAmount = document.getElementById('targetAmount').value;
            const currentAmount = document.getElementById('currentAmount').value;
            const description = document.getElementById('savingsGoalDescription').value;
            const targetDate = document.getElementById('targetDate').value;
            const userId = sessionStorage.getItem('userId');

            if (!userId) {
                showMessage('Not logged in. Redirecting to login page...', false);
                setTimeout(() => {
                    window.location.href = '/login.html';
                }, 1000);
                return;
            }

            const savingsGoalData = {
                user_id: userId,
                target_amount: parseFloat(targetAmount),
                current_amount: parseFloat(currentAmount),
                description,
                target_date: targetDate
            };
            handleAddSavingsGoal(savingsGoalData);
        });
    }
});

// Event listener for the expense form
document.addEventListener('DOMContentLoaded', function() {
    var addExpenseForm = document.getElementById('addExpenseForm');
    if (addExpenseForm) {
        addExpenseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const expenseName = document.getElementById('expenseName').value;
            const expenseAmount = document.getElementById('expenseAmount').value;
            const expenseDate = document.getElementById('expenseDate').value;
            const expenseDescription = document.getElementById('expenseDescription').value;
            const userId = sessionStorage.getItem('userId');

            if (!userId) {
                showMessage('Not logged in. Redirecting to login page...', false);
                setTimeout(() => {
                    window.location.href = '/login.html';
                }, 1000);
                return; // Exit the function if no userId is found
            }

            const expenseData = {
                user_id: userId,
                name: expenseName,
                amount: parseFloat(expenseAmount),
                expense_date: expenseDate,
                description: expenseDescription
            };
            handleAddExpense(expenseData);
        });
    }
});
