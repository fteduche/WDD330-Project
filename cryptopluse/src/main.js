import axios from 'axios';

const setCryptos = (cryptos) => {
  let innerHTML = '';
  cryptos.forEach((crypto) => {
    innerHTML += `<tr key=${crypto.id}>
      <td>${crypto.rank}</td>
      <td>${crypto.name}</td>
      <td>${crypto.symbol}</td>
      <td>${parseFloat(crypto.price_usd).toFixed(2)}</td>
      <td>${parseFloat(crypto.percent_change_24h).toFixed(4)}</td>
    </tr>`;
  });
  document.getElementById('crypto-table-body').innerHTML = innerHTML;
};

const fetchData = async () => {
  try {
    const result = await axios.get('https://api.coinlore.net/api/tickers/');
    console.log(result);
    setCryptos(result.data.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    console.error('Error details:', error);
  }
};

fetchData();