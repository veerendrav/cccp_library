// const EXCEL_FILE_URL = 'https://veerendrav.github.io/cccp_library/library_books.xlsx'; // Update with your actual URL
const EXCEL_FILE_URL = './library_books.xlsx'
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

    data.forEach(book => {
        const { Title, Author, Category, Borrower, BorrowedDate, ReturnDate } = book;

        if (Borrower) {
            // Book is borrowed
            const borrowedRow = `
                <tr>
                    <td>${Title}</td>
                    <td>${Borrower}</td>
                    <td>${BorrowedDate || 'N/A'}</td>
                    <td>${ReturnDate || 'N/A'}</td>
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
