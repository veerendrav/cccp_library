const EXCEL_FILE_URL = 'https://veerendrav.github.io/cccp_library/library_books.xlsx'; // Update with your actual URL
// const EXCEL_FILE_URL = './library_books.xlsx'
// Fetch the Excel file periodically
function fetchExcelFile() {
    fetch(EXCEL_FILE_URL)
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);
            displayBooks(jsonData);
        })
        .catch(error => console.error('Error fetching or reading the Excel file:', error));
}

// Display books data in tables
function displayBooks(data) {
    const availableBooksTable = document.querySelector('#available-books tbody');
    const borrowedBooksTable = document.querySelector('#borrowed-books tbody');

    // Clear any previous data
    availableBooksTable.innerHTML = '';
    borrowedBooksTable.innerHTML = '';

    // Function to format the Excel date to DD/MM/YYYY format
    function formatDate(excelDate) {
        if (!excelDate) return 'N/A';  // If no date is provided, return 'N/A'

        // Excel dates are serialized as the number of days since 1st Jan 1900
        const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000));

        // Extract day, month, and year
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');  // Months are 0-based
        const year = date.getUTCFullYear();

        return `${month}/${day}/${year}`;
    }

    data.forEach(book => {
        const { Title, Author, Category, Borrower, BorrowedDate, ReturnDate } = book;

        if (Borrower) {
            // Book is borrowed, format BorrowedDate and ReturnDate
            const borrowedRow = `
                <tr>
                    <td>${Title}</td>
                    <td>${Borrower}</td>
                    <td>${formatDate(BorrowedDate)}</td>
                    <td>${formatDate(ReturnDate)}</td>
                </tr>
            `;
            borrowedBooksTable.insertAdjacentHTML('beforeend', borrowedRow);
        } else {
            // Book is available
            const availableRow = `
                <tr>
                    <td>${Title}</td>
                    <td>${Author}</td>
                    <td>${Category}</td>
                </tr>
            `;
            availableBooksTable.insertAdjacentHTML('beforeend', availableRow);
        }
    });
}


// Fetch and display the Excel file when the page loads
fetchExcelFile();

// Set an interval to periodically update the book data (every 5 minutes)
setInterval(fetchExcelFile, 300000);  // 300000 ms = 5 minutes
