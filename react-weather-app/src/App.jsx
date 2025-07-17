import { useState } from 'react';
import getWindDirection from './winddirection';
import './App.css';

function App() {
  const APIKEY = '780b6905813c94c10d1b826a913997cb';
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  const handleSearch = async () => {
    if (city.trim() === '') {
      alert('Please enter a city name');
      return;
    }

    setLoading(true);
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}&units=metric`
      );

      if (!response.ok) {
        alert('City not found');
        setLoading(false);
        return;
      }

      const data = await response.json();
      setWeather(data);
    } catch (error) {
      alert('An error occurred while fetching data');
    } finally {
      setLoading(false);
      setCity('');
    }
  };


  const handleLocation = () => {
    setLoading(true);
    setCity('')
    setWeather(null);
    setLoading(false);


    navigator.geolocation.getCurrentPosition(
      async (position) => {
      const{latitude, longitude} = position.coords;
      console.log(latitude, longitude);
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIKEY}&units=metric`);
      const data = await response.json()
      setWeather(data);

      
    })
  }


  return (
    <div className="app-container">
      <h1 style={{textAlign: 'center', color: 'black'}} >Weather App</h1>
      <input
        type="text"
        value={city}
        placeholder="Enter city to search 🔍"
        onChange={handleInputChange}
        onKeyDown={(e) => {if (e.key === "Enter") {handleSearch()}}}
      />
      <button onClick={handleSearch}>Search</button>
      <button onClick={handleLocation}>My location 📍</button>

      {loading && <p className="loading">Loading...</p>}

      {weather && (
  <div className="weather-info">
    <h2>Weather in {weather.name}</h2>
    <img
      src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
      alt={weather.weather[0].description}
      className="weather-icon"
    />
    <p><strong>Temperature:</strong> {weather.main.temp}°C</p>
    <p><strong>Feels Like:</strong> {weather.main.feels_like}°C</p>
    <p><strong>Condition:</strong> {weather.weather[0].main}</p>
    <p><strong>Description:</strong> {weather.weather[0].description}</p>
    <p><strong>Humidity:</strong> {weather.main.humidity}%</p>
    <p><strong>Wind Speed:</strong> {weather.wind.speed} m/s ({(weather.wind.speed * 3.6).toFixed(2)} km/h)</p>
    <p><strong>Wind Direction:</strong> {getWindDirection(weather.wind.deg)}</p>
    <p><strong>Date & Time:</strong>  {new Date(weather.dt*1000).toLocaleString()}</p>
  </div>
)}

    </div>
  );
}

export default App;
