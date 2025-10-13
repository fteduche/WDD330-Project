// import axios from 'axios';

// const setCryptos = (cryptos) => {
//   let innerHTML = '';
//   cryptos.forEach((crypto) => {
//     innerHTML += `<tr key=${crypto.id}>
//       <td>${crypto.rank}</td>
//       <td>${crypto.name}</td>
//       <td>${crypto.symbol}</td>
//       <td>${parseFloat(crypto.price_usd).toFixed(2)}</td>
//       <td>${parseFloat(crypto.percent_change_24h).toFixed(4)}</td>
//     </tr>`;
//   });
//   document.getElementById('crypto-table-body').innerHTML = innerHTML;
// };

// const fetchData = async () => {
//   try {
//     const result = await axios.get('https://api.coinlore.net/api/tickers/');
//     console.log(result);
//     setCryptos(result.data.data);
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     console.error('Error details:', error);
//   }
// };

// fetchData();

import axios from 'axios';

// Configuration
const ITEMS_PER_PAGE = 10; // Define how many items to show per page
let currentPage = 1;      // Current page state

/**
 * Renders the cryptocurrency data to the HTML table.
 * @param {Array} cryptos - The list of cryptocurrency objects for the current page.
 */
const setCryptos = (cryptos) => {
  let innerHTML = '';
  cryptos.forEach((crypto) => {
    innerHTML += `<tr key=${crypto.id}>
            <td>${crypto.rank}</td>
            <td>${crypto.name}</td>
            <td>${crypto.symbol}</td>
            <td>$${parseFloat(crypto.price_usd).toFixed(2)}</td>
            <td>${parseFloat(crypto.percent_change_24h).toFixed(4)}%</td>
        </tr>`;
  });
  document.getElementById('crypto-table-body').innerHTML = innerHTML;
};

/**
 * Handles the logic for updating the pagination buttons (Previous/Next).
 * @param {number} currentStart - The starting offset of the current data.
 * @param {number} limit - The number of items per page.
 */
const updatePaginationControls = (currentStart, limit) => {
  const prevButton = document.getElementById('prev-button');
  const nextButton = document.getElementById('next-button');

  // Enable/Disable Previous button
  if (prevButton) {
    prevButton.disabled = currentStart === 0;
  }

  // Since the API doesn't return total count, we optimistically enable 'Next'
  // and let the next fetch determine if it was the last page (by returning less than 'limit').
  // If the API returns exactly 'limit', there might be more data.
  // If it returns less than 'limit', it's the last page.
  // For simplicity, we assume if we got a full page, there might be more.
  if (nextButton) {
    nextButton.disabled = false; // Always enabled unless we know we're at the end
  }

  // Update current page display
  const pageIndicator = document.getElementById('page-indicator');
  if (pageIndicator) {
    pageIndicator.textContent = `Page ${currentPage}`;
  }
};

/**
 * Fetches data from the CoinLore API with pagination parameters.
 * @param {number} page - The page number to fetch.
 */
const fetchData = async (page = 1) => {
  currentPage = page;
  const start = (page - 1) * ITEMS_PER_PAGE;
  const limit = ITEMS_PER_PAGE;

  try {
    // Constructing the API URL with pagination parameters
    const url = `https://api.coinlore.net/api/tickers/?start=${start}&limit=${limit}`;
    const result = await axios.get(url);

    const cryptos = result.data.data;
    setCryptos(cryptos);

    // Check if this was the last page returned by the API
    if (cryptos.length < limit) {
      const nextButton = document.getElementById('next-button');
      if (nextButton) {
        nextButton.disabled = true;
      }
    } else {
      const nextButton = document.getElementById('next-button');
      if (nextButton) {
        nextButton.disabled = false;
      }
    }

    updatePaginationControls(start, limit);

  } catch (error) {
    console.error('Error fetching data:', error);
    // Display an error message to the user if needed
  }
};

/**
 * Event handler for the Previous button.
 */
const goToPreviousPage = () => {
  if (currentPage > 1) {
    fetchData(currentPage - 1);
  }
};

/**
 * Event handler for the Next button.
 */
const goToNextPage = () => {
  fetchData(currentPage + 1);
};

// Initialize listeners and fetch the first page
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('prev-button').addEventListener('click', goToPreviousPage);
  document.getElementById('next-button').addEventListener('click', goToNextPage);
  fetchData(1);
});