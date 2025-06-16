import { useEffect, useState } from 'react';
// import './App.css';
import './index.css';

function App() {
  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('london');
  const [forecast, setForecast] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeatherData = async (cityName) => {
    setCity(cityName);
    try {
      // Error Handling
      setLoading(true);
      setError(null);

      // Day's weather
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();
      setWeatherData(data);
      console.log(data);

      // Forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await forecastResponse.json();

      const dailyForecast = forecastData.list.filter(
        (item, index) => index % 8 === 0
      );
      setForecast(dailyForecast);
    } catch (error) {
      setError('Could not fetch data, please try again!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  function handleSearch(e) {
    if (searchInput.trim() === '') {
      setError('Please enter a city name.');
      return;
    } else {
      e.preventDefault();
      fetchWeatherData(searchInput);
      setSearchInput('');
    }
  }

  if (loading) return <div className="wrapper">Loading...</div>;
  else if (
    weatherData &&
    weatherData.main &&
    weatherData.weather &&
    forecast.length > 0
  ) {
    return (
      <div className="wrapper">
        <form
          onSubmit={handleSearch}
          className="search-form form"
          style={{ textAlign: 'center' }}
        >
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Enter city name"
            className="search-input"
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>
        {error && <p className="error">{error}</p>}
        <div className="header">
          <h1 className="city">{weatherData.name}</h1>
          <p className="temperature">{Math.floor(weatherData.main.temp)}°C</p>
          <p className="condition">{weatherData.weather[0].main}</p>
        </div>
        <div className="weather-details">
          <div>
            <p>Humidity</p>
            <p style={{ fontWeight: 'bold' }}>
              {Math.round(weatherData.main.humidity)}%
            </p>
          </div>
          <div>
            <p>Wind Speed</p>
            <p style={{ fontWeight: 'bold' }}>
              {Math.round(weatherData.wind.speed)} mph
            </p>
          </div>
        </div>

        <div className="forecast">
          <h2 className="forecast-header">5-day Forecast</h2>
          <div className="forecast-days">
            {forecast.map((day, index) => (
              <div key={index} className="forecast-day">
                <p>
                  {new Date(day.dt * 1000).toLocaleDateString('en-US', {
                    weekday: 'short',
                  })}
                </p>
                <img
                  src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                  alt={day.weather[0].description}
                />
                <p>{Math.round(day.main.temp)}°C</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
