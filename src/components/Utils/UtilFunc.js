import axios from "axios";

function numberConvert(number) {
  let num = Math.abs(Number(number));
  let sign = Math.sign(num);

  if (num >= 1e7)
    return `${sign * (num / 1e7).toFixed(2)} CR`;
  else if (num >= 1e5)
    return `${sign * (num / 1e5).toFixed(2)} L`;
  else if (num >= 1e3)
    return `${sign * (num / 1e3).toFixed(2)} K`;
  else
    return (sign * num).toString();
}

async function fetchPlayerData(serverUrl, playerID) {
  try {
    const response = await axios.post(`${serverUrl}/getPlayer`, { _id: playerID }, { headers: { "Content-Type": "application/json" } });
    return response.data;
  } catch (error) {
    console.error('Error fetching player data for ID', playerID, ':', error);
    throw error;
  }
}

export { numberConvert ,fetchPlayerData };