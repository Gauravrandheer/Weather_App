import React, { useState } from "react";
import "./Weather.css";

function Weather() {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);

  const apiKey = import.meta.env.VITE_API_KEY;
 
  const fetchWeatherDatabycity = async () => {
    try {
      setLat(null);
      setLon(null);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
      );

      if (response.ok) {
        const data = await response.json();

        if (data.cod === 200) {
          console.log(data);
          setWeatherData(data);
          setError(null);
        }
        if (data.cod === 404) {
          setError(data.message);
        }
      } else {
        setWeatherData(null);
        setError("No City found.");
      }
    } catch (error) {
      setWeatherData(null);
      setError("Error fetching weather data. Please try again.");
    }
  };

  const fetchWeatherDatathroughlatlong = async () => {
    try {
      setLocation("");
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );

      if (response.ok) {
        const data = await response.json();

        if (data.cod === 200) {
          setWeatherData(data);
          setError(null);
        }
        if (data.cod === 404) {
          setError(data.message);
        }
      } else {
        setWeatherData(null);
        setError("No City found.");
      }
    } catch (error) {
      setWeatherData(null);
      setError("Error fetching weather data. Please try again.");
    }
  };

  React.useEffect(() => {
    if (lat !== null && lon !== null) {
      fetchWeatherDatathroughlatlong();
    }
  }, [lat, lon]);

  const getDevicelocationhandler = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLon(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      alert(
        "It seems like Geolocation, which is required for this page, is not enabled in your browser. Please use a browser which supports it."
      );
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      fetchWeatherDatabycity();
    }
  };

  return (
    <>
      {!weatherData && (
        <div className="container">
          <h1>Weather App</h1>
          <hr></hr>
          <div className="weather_info_input">
            <input
              type="text"
              placeholder="Enter City Name"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              onKeyPress={handleKeyPress}
              spellCheck="false"
            />
            <div className="or-container">
              <hr />
              <span className="or-text">or</span>
              <hr />
            </div>
            <button onClick={() => getDevicelocationhandler()}>
              Get Device Location
            </button>
          </div>

          {error && <div className="error">{error}</div>}
        </div>
      )}
      {weatherData && (
        <div className="container">
          <h1
            style={{ cursor: "pointer" }}
            onClick={() => setWeatherData(null)}
          >
            {" "}
            ⬅ Weather App
          </h1>
          <hr></hr>
          <div className="weather_info_display">
            <img
              src={`http://openweathermap.org/img/w/${weatherData?.weather[0]?.icon}.png`}
              alt={weatherData?.weather[0]?.description}
            />
            <div className="weather_data">
              <h2>{weatherData?.main.temp} C</h2>
              <p className="weather_main"> {weatherData?.weather[0]?.main}</p>
              <p className="weather_sys">
                {weatherData?.name},{weatherData?.sys?.country}
              </p>
            </div>
            <hr />
            <div className="more_data">
              <div className="left_data">
                <span>Feel like: </span>
                {weatherData?.main.feels_like} C 🌡️
              </div>

              <div className="right_data">
                <span>Humidity: </span>
                {weatherData?.main?.humidity}% 💧
              </div>
            </div>
          </div>

          {error && <div className="error">{error}</div>}
        </div>
      )}
    </>
  );
}

export default Weather;
