import { useState , useEffect} from "react";
import getWindDirection from "./winddirection";
import "./App.css";

function App() {
  const APIKEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("weatherHistory");
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    localStorage.setItem("weatherHistory", JSON.stringify(history));
  }, [history]);



  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  const handleSearch = async (searchCity) => {
    const cityToSearch = searchCity !== undefined ? searchCity : city;
    console.log("city",city)
    console.log("cityToSearch",cityToSearch)
    console.log("searchCity",searchCity)
    if (cityToSearch.trim() === "") {
      alert("Please enter a city name");
      return;
    }

    setLoading(true);
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityToSearch}&appid=${APIKEY}&units=metric`
      );

      if (!response.ok) {
        alert("City not found");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setWeather(data);
      setHistory((prev) => (prev.includes(cityToSearch) ? prev : [...prev, cityToSearch]));
    } catch (error) {
      alert("An error occurred while fetching data");
    } finally {
      setLoading(false);
      setCity("");
      console.log(history);
    }
  };

  const handleLocation = () => {
    setLoading(true);
    setCity("");
    setWeather(null);
    setLoading(false);

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      console.log(latitude, longitude);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIKEY}&units=metric`
      );
      const data = await response.json();
      setWeather(data);
    });
  };
  const handleHistoryClick = (his) => {
    setCity(his);
    handleSearch(his);
  };

  return (
    <div className="app-container">
      <h1 style={{ textAlign: "center", color: "black" }}>Weather App</h1>
      <input
        type="text"
        value={city}
        placeholder="Enter city to search 🔍"
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <div className="button-group">
        <button onClick={handleSearch}>Search</button>
        <button onClick={handleLocation}>My location 📍</button>
      </div>
      <ul className="history-list">
        {history.map((his, index) => (
          <li key={index} onClick={() => handleHistoryClick(his)}>
            {his}
          </li>
        ))}
      </ul>

      {loading && <p className="loading">Loading...</p>}

      {weather && (
        <div className="weather-info">
          <h2>Weather in {weather.name}</h2>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
            alt={weather.weather[0].description}
            className="weather-icon"
          />
          <p>
            <strong>Temperature:</strong> {weather.main.temp}°C
          </p>
          <p>
            <strong>Feels Like:</strong> {weather.main.feels_like}°C
          </p>
          <p>
            <strong>Condition:</strong> {weather.weather[0].main}
          </p>
          <p>
            <strong>Description:</strong> {weather.weather[0].description}
          </p>
          <p>
            <strong>Humidity:</strong> {weather.main.humidity}%
          </p>
          <p>
            <strong>Wind Speed:</strong> {weather.wind.speed} m/s (
            {(weather.wind.speed * 3.6).toFixed(2)} km/h)
          </p>
          <p>
            <strong>Wind Direction:</strong>{" "}
            {getWindDirection(weather.wind.deg)}
          </p>
          <p>
            <strong>Date & Time:</strong>{" "}
            {new Date(weather.dt * 1000).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
