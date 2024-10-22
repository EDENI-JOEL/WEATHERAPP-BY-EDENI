import React, { useState, useEffect } from 'react';
import { Search, Wind, Droplet, Thermometer } from 'lucide-react';

const API_KEY = 'ba17d6ca665505d2eec028787399cc44';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const WeatherApp = () => {
  const [city, setCity] = useState('Lagos');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeatherData = async (cityName) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}?q=${cityName}&appid=${API_KEY}`);
      const data = await response.json();
      
      if (data.cod !== 200) {
        throw new Error(data.message);
      }
      
      setWeatherData(data);
    } catch (error) {
      setError('City not found or network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(city);
  },);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeatherData(city);
  };

  const kelvinToCelsius = (kelvin) => {
    return Math.round(kelvin - 273.15);
  };

  return (
    <div className="weather-card">
      <form onSubmit={handleSearch} className="search-box">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
        />
        <button type="submit" disabled={loading}>
          {loading ? (
            <div className="loading-spinner" />
          ) : (
            <Search size={20} />
          )}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {weatherData && (
        <div className="weather-info">
          <h2 className="city">{`${weatherData.name}, ${weatherData.sys.country}`}</h2>
          <p className="date">
            {new Date(weatherData.dt * 1000).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </p>
          <div className="weather-icon">
            <img
              src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt="Weather Icon"
            />
          </div>
          <p className="temperature">{`${kelvinToCelsius(weatherData.main.temp)}°C`}</p>
          <p className="weather-condition">
            {weatherData.weather[0].description
              .split(' ')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
          </p>
          <div className="weather-details">
            <div className="detail">
              <Droplet size={24} />
              <p className="detail-label">Humidity</p>
              <p className="detail-value">{`${weatherData.main.humidity}%`}</p>
            </div>
            <div className="detail">
              <Wind size={24} />
              <p className="detail-label">Wind</p>
              <p className="detail-value">{`${Math.round(weatherData.wind.speed * 3.6)} km/h`}</p>
            </div>
            <div className="detail">
              <Thermometer size={24} />
              <p className="detail-label">Feels Like</p>
              <p className="detail-value">{`${kelvinToCelsius(weatherData.main.feels_like)}°C`}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;