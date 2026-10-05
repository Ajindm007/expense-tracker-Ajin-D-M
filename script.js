// To store all transactions
let transactions = [];


// To remember which transaction is being edited
let editingTransactionId = null;


// To store the created chart
let expenseChartInstance = null;


// For formatting amounts as Indian Rupees
const currencyFormatter = new Intl.NumberFormat("en-IN", {

    style: "currency",
    currency: "INR"

});


// To get the form element
const transactionForm =
    document.getElementById("transaction-form");


// Taking input from user
const typeInput =
    document.getElementById("type");

const amountInput =
    document.getElementById("amount");

const categoryInput =
    document.getElementById("category");

const dateInput =
    document.getElementById("date");

const descriptionInput =
    document.getElementById("description");


// For getting the transaction list
const transactionList =
    document.getElementById("transaction-list");


// For displaying validation error messages
const errorMessage =
    document.getElementById("error-message");


// For getting the filter elements
const filterType =
    document.getElementById("filter-type");

const filterCategory =
    document.getElementById("filter-category");


// For getting monthly expense elements
const monthSelect =
    document.getElementById("month-select");

const monthlyExpense =
    document.getElementById("monthly-expense");


// For getting the expense chart
const expenseChart =
    document.getElementById("expense-chart");


// Set today's date
const today = new Date();

const year = today.getFullYear();

const month = String(
    today.getMonth() + 1
).padStart(2, "0");

const day = String(
    today.getDate()
).padStart(2, "0");

dateInput.value = `${year}-${month}-${day}`;


// Set current month
monthSelect.value = `${year}-${month}`;


// Form submission
transactionForm.addEventListener(
    "submit",
    function (event) {

        // Prevent page refresh
        event.preventDefault();


        // Get values from the form
        const type = typeInput.value;

        const amount =
            Number(amountInput.value);

        const category =
            categoryInput.value;

        const date =
            dateInput.value;

        const description =
            descriptionInput.value.trim();


        // Clear previous error
        errorMessage.textContent = "";


        // Validate amount
        if (amount <= 0) {

            errorMessage.textContent =
                "Please enter a valid amount.";

            return;

        }


        // Validate category
        if (category === "") {

            errorMessage.textContent =
                "Please select a category.";

            return;

        }


        // Validate date
        if (date === "") {

            errorMessage.textContent =
                "Please select a date.";

            return;

        }


        // Validate description
        if (description === "") {

            errorMessage.textContent =
                "Please enter a description.";

            return;

        }


        // Check if editing
        if (editingTransactionId !== null) {

            const transaction =
                transactions.find(function (item) {

                    return item.id === editingTransactionId;

                });


            if (transaction) {

                transaction.type = type;

                transaction.amount = amount;

                transaction.category = category;

                transaction.date = date;

                transaction.description =
                    description;

            }


            // Exit editing mode
            editingTransactionId = null;


            // Restore button text
            transactionForm
                .querySelector(
                    'button[type="submit"]'
                )
                .textContent =
                "Add Transaction";


            // Restore heading
            document
                .querySelector(".transaction-form h2")
                .textContent =
                "Add Transaction";


        } else {

            // Create transaction object
            const transaction = {

                id: Date.now(),

                type: type,

                amount: amount,

                category: category,

                date: date,

                description: description

            };


            // Add transaction
            transactions.push(transaction);

        }


        // Save transactions
        localStorage.setItem(
            "transactions",
            JSON.stringify(transactions)
        );


        // Update everything
        displayTransactions();

        updateSummary();

        updateMonthlyExpense();

        updateExpenseChart();


        // Clear form
        transactionForm.reset();


        // Set today's date again
        dateInput.value =
            `${year}-${month}-${day}`;

    }
);


// Display transactions
function displayTransactions() {

    // Clear existing list
    transactionList.innerHTML = "";


    // Get selected filters
    const selectedType =
        filterType.value;

    const selectedCategory =
        filterCategory.value;


    // Filter transactions
    const filteredTransactions =
        transactions.filter(function (transaction) {

            const typeMatches =
                selectedType === "all" ||
                transaction.type === selectedType;


            const categoryMatches =
                selectedCategory === "all" ||
                transaction.category === selectedCategory;


            return typeMatches && categoryMatches;

        });


    // Check if there are no matching transactions
    if (filteredTransactions.length === 0) {

        if (transactions.length === 0) {

            transactionList.innerHTML =
                "<p>No transactions added yet.</p>";

        } else {

            transactionList.innerHTML =
                "<p>No transactions found for the selected filter.</p>";

        }

        return;

    }


    // Display filtered transactions
    filteredTransactions.forEach(
        function (transaction) {

            const transactionElement =
                document.createElement("div");


            transactionElement.classList.add(
                "transaction-item"
            );


            const sign =
                transaction.type === "income"
                    ? "+"
                    : "-";


            transactionElement.innerHTML = `

                <div class="transaction-info">

                    <h3>
                        ${transaction.description}
                    </h3>

                    <p>
                        ${transaction.category}
                        |
                        ${transaction.date}
                        |
                        ${transaction.type}
                    </p>

                </div>


                <div class="transaction-amount ${transaction.type}">

                    ${sign}${currencyFormatter.format(transaction.amount)}

                </div>


                <div class="transaction-actions">

                    <button
                        class="edit-btn"
                        onclick="editTransaction(${transaction.id})"
                    >
                        Edit
                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteTransaction(${transaction.id})"
                    >
                        Delete
                    </button>

                </div>

            `;


            transactionList.appendChild(
                transactionElement
            );

        }
    );

}


// Update summary
function updateSummary() {

    let totalIncome = 0;

    let totalExpense = 0;


    // Calculate totals
    transactions.forEach(
        function (transaction) {

            if (transaction.type === "income") {

                totalIncome +=
                    transaction.amount;

            } else if (
                transaction.type === "expense"
            ) {

                totalExpense +=
                    transaction.amount;

            }

        }
    );


    // Calculate balance
    const balance =
        totalIncome - totalExpense;


    // Display summary
    document.getElementById(
        "total-income"
    ).textContent =
        currencyFormatter.format(totalIncome);


    document.getElementById(
        "total-expense"
    ).textContent =
        currencyFormatter.format(totalExpense);


    document.getElementById(
        "balance"
    ).textContent =
        currencyFormatter.format(balance);

}


// Edit transaction
function editTransaction(id) {

    // Find transaction
    const transaction =
        transactions.find(function (item) {

            return item.id === id;

        });


    // Stop if transaction doesn't exist
    if (!transaction) {

        return;

    }


    // Remember editing transaction
    editingTransactionId = id;


    // Fill form
    typeInput.value =
        transaction.type;

    amountInput.value =
        transaction.amount;

    categoryInput.value =
        transaction.category;

    dateInput.value =
        transaction.date;

    descriptionInput.value =
        transaction.description;


    // Change button
    transactionForm
        .querySelector(
            'button[type="submit"]'
        )
        .textContent =
        "Update Transaction";


    // Change heading
    document
        .querySelector(".transaction-form h2")
        .textContent =
        "Edit Transaction";


    // Clear old error
    errorMessage.textContent = "";


    // Scroll to form
    transactionForm.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

}


// Delete transaction
function deleteTransaction(id) {

    // Ask for confirmation
    const confirmDelete =
        confirm(
            "Are you sure you want to delete this transaction?"
        );


    // Stop if cancelled
    if (!confirmDelete) {

        return;

    }


    // Remove transaction
    transactions =
        transactions.filter(
            function (transaction) {

                return transaction.id !== id;

            }
        );


    // Save updated transactions
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );


    // Update everything
    displayTransactions();

    updateSummary();

    updateMonthlyExpense();

    updateExpenseChart();

}


// Filter by type
filterType.addEventListener(
    "change",
    function () {

        displayTransactions();

    }
);


// Filter by category
filterCategory.addEventListener(
    "change",
    function () {

        displayTransactions();

    }
);


// Update monthly expense
function updateMonthlyExpense() {

    const selectedMonth =
        monthSelect.value;


    let monthlyTotal = 0;


    // Calculate monthly expenses
    transactions.forEach(
        function (transaction) {

            if (
                transaction.type === "expense" &&
                transaction.date.startsWith(selectedMonth)
            ) {

                monthlyTotal +=
                    transaction.amount;

            }

        }
    );


    // Display monthly expense
    monthlyExpense.textContent =
        currencyFormatter.format(monthlyTotal);

}


// Update when month changes
monthSelect.addEventListener(
    "change",
    function () {

        updateMonthlyExpense();

    }
);


// Update category-wise expense chart
function updateExpenseChart() {

    // Store category totals
    const categoryTotals = {};


    // Calculate category totals
    transactions.forEach(
        function (transaction) {

            if (transaction.type === "expense") {

                if (
                    !categoryTotals[
                        transaction.category
                    ]
                ) {

                    categoryTotals[
                        transaction.category
                    ] = 0;

                }


                categoryTotals[
                    transaction.category
                ] += transaction.amount;

            }

        }
    );


    // Get category names
    const categories =
        Object.keys(categoryTotals);


    // Get amounts
    const amounts =
        Object.values(categoryTotals);


    // Destroy previous chart
    if (expenseChartInstance) {

        expenseChartInstance.destroy();

        expenseChartInstance = null;

    }


    // If there are no expenses,
    // don't create an empty chart
    if (categories.length === 0) {

        return;

    }


    // Create chart
    expenseChartInstance =
        new Chart(
            expenseChart,
            {

                type: "pie",

                data: {

                    labels: categories,

                    datasets: [{

                        data: amounts

                    }]

                },

                options: {

                    responsive: true

                }

            }
        );

}


// Load saved transactions
const savedTransactions =
    localStorage.getItem("transactions");


if (savedTransactions) {

    transactions =
        JSON.parse(savedTransactions);

}


// Display saved data
displayTransactions();

updateSummary();

updateMonthlyExpense();

updateExpenseChart();






