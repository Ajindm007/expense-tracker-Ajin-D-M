
# How to Run the Application

Follow these steps to run the Expense Tracker on your computer.

## Step 1: Open the Project

Open the `expense-tracker` folder in Visual Studio Code.

The folder should contain:

```text
expense-tracker/
│
├── index.html
├── style.css
├── script.js
└── README.md
````

## Step 2: Open `index.html`

In VS Code, open the `index.html` file.

## Step 3: Run the Application

There are two simple ways to run the application.

### Method 1: Using Live Server — Recommended

1. Open VS Code.
2. Install the **Live Server** extension if it is not already installed.
3. Open `index.html`.
4. Right-click anywhere inside the `index.html` file.
5. Select **Open with Live Server**.
6. The application will automatically open in your default web browser.

The application will run at a local address similar to:

```text
http://127.0.0.1:5500/index.html
```

The exact port number may be different.

### Method 2: Open Directly in Browser

You can also run the application without Live Server.

1. Open the `expense-tracker` folder.
2. Find `index.html`.
3. Double-click `index.html`.
4. The application will open in your web browser.

## Step 4: Use the Application

After opening the application:

1. Select **Income** or **Expense**.
2. Enter the amount.
3. Select a category.
4. Select the date.
5. Enter a description.
6. Click **Add Transaction**.

The transaction will appear in the transaction list.

## Step 5: Test the Features

You can test:

* Adding income
* Adding expenses
* Editing transactions
* Deleting transactions
* Filtering transactions
* Monthly expense calculation
* Category-wise expense chart
* Local Storage
* Responsive mobile layout

## Important

The application uses **Local Storage**, so transaction data is stored in the browser.

Refreshing the page will not remove the transactions.

However, clearing the browser's site data or Local Storage will remove the saved transactions.

The expense chart uses **Chart.js through a CDN**, so an internet connection is required for the chart library to load.





