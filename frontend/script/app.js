// Update the API endpoint based on your Flask server address
const API_ENDPOINT = 'http://127.0.0.1:5000';

function fetchData(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    return fetch(`${API_ENDPOINT}${endpoint}`, options)
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function displayData(data) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <h2>Comprehensive Financial Report</h2>
        <p>Total Users: ${data.total_users}</p>
        <p>Total Transactions: ${data.total_transactions}</p>
        <p>Total Debts: ${data.total_debts}</p>
        <!-- Add more display for other data as needed -->
    `;
}

// Example usage for fetching user data
function fetchUserData(userId) {
    fetchData(`/users/${userId}`)
        .then(data => {
            // Handle user data
            console.log('User Data:', data);
        });
}

// Example usage for creating a new transaction
function createTransaction(transactionData) {
    fetchData('/transactions', 'POST', transactionData)
        .then(data => {
            // Handle created transaction data
            console.log('Created Transaction:', data);
        });
}


// Example usage for updating a user
function updateUser(userId, userData) {
    fetchData(`/users/${userId}`, 'PUT', userData)
        .then(data => {
            // Handle updated user data
            console.log('Updated User:', data);
        });
}

// Example usage for deleting a user
function deleteUser(userId) {
    fetchData(`/users/${userId}`, 'DELETE')
        .then(data => {
            // Handle deleted user data
            console.log('Deleted User:', data);
        });
}

// Example usage for generating a comprehensive report
function generateComprehensiveReport() {
    fetchData('/reports/comprehensive')
        .then(data => {
            // Handle comprehensive report data
            displayData(data);
        });
}


