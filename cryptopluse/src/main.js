import axios from 'axios';

const setCryptos = (cryptos) => {
  let innerHTML = '';
  cryptos.forEach(
    (crypto) => {
      `<tr key=${crypto.id}>
      <td>${crypto.rank}</td>
      <td>${crypto.name}</td>
      <td>${crypto.symbol}</td>
      <td>${parseFloat(crypto.priceUsd).toFixed(2)}</td>
      <td>${parseFloat(crypto.changePercent24Hr).toFixed(4)}</td>
    </tr>`}
  );
  document.getElementById('crypto-table-body').innerHTML = innerHTML;
}

const fetchData = async () => {
  try {
    const result = await axios.get('https://api.coincap.io/v2/assets', { timeout: 5000 });
    //const result = await axios('https://api.coincap.io/v2/assets');
    console.log(result);
    setCryptos(result.data.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    console.error('Error details:', error);
  }
};

fetchData();