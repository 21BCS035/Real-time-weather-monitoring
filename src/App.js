import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { WEATHER_API_URL, WEATHER_API_KEY } from './apikey';
import WeatherSummary from './WeatherSummary';
import WeatherAlerts from './WeatherAlerts';
import { Grid, Card, CardContent, Typography, Container, CircularProgress, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';

const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

const StyledCard = styled(motion(Card))(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[6],
  borderRadius: '15px',
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.primary.main}`,
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[8],
  },
}));

const App = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [dailySummary, setDailySummary] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [consecutiveBreaches, setConsecutiveBreaches] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(''); 
  const alertThreshold = 25; 
  const FETCH_INTERVAL = 10000; 

  const fetchWeatherData = async () => {
    try {
      const weatherResponses = await Promise.all(
        cities.map((city) =>
          axios.get(
            `${WEATHER_API_URL}/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
          )
        )
      );

      const forecastResponses = await Promise.all(
        cities.map((city) =>
          axios.get(
            `${WEATHER_API_URL}/forecast?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
          )
        )
      );

      const weatherData = weatherResponses.map((response) => ({
        city: response.data.name,
        main: response.data.weather[0].main,
        temp: response.data.main.temp,
        feels_like: response.data.main.feels_like,
        humidity: response.data.main.humidity,
        wind_speed: response.data.wind.speed,
        timestamp: response.data.dt,
      }));

      const forecastData = forecastResponses.map((response) => ({
        city: response.data.city.name,
        forecast: processForecast(response.data.list)
      }));

      setWeatherData(weatherData);
      setForecastData(forecastData);
      processDailySummary(weatherData);
      checkForAlerts(weatherData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  useEffect(() => {
  
    fetchWeatherData();

    const intervalId = setInterval(fetchWeatherData, FETCH_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  const processForecast = (forecastList) => {
    const dailyForecast = {};

    forecastList.forEach((forecast) => {
      const date = new Date(forecast.dt * 1000).toLocaleDateString();
      if (!dailyForecast[date]) {
        dailyForecast[date] = {
          temp: forecast.main.temp,
          feels_like: forecast.main.feels_like,
          humidity: forecast.main.humidity,
          wind_speed: forecast.wind.speed,
          main: forecast.weather[0].main,
          dt: forecast.dt
        };
      }
    });

    return Object.values(dailyForecast);
  };

  const processDailySummary = (data) => {
    const today = new Date().toISOString().slice(0, 10);
    const dailyData = data.filter(
      (entry) => new Date(entry.timestamp * 1000).toISOString().slice(0, 10) === today
    );

    if (dailyData.length) {
      const temperatures = dailyData.map((entry) => entry.temp);
      const avgTemp = temperatures.reduce((a, b) => a + b, 0) / temperatures.length;
      const maxTemp = Math.max(...temperatures);
      const minTemp = Math.min(...temperatures);
      const dominantCondition = calculateDominantCondition(dailyData);

      setDailySummary({
        avgTemp,
        maxTemp,
        minTemp,
        dominantCondition,
      });
    }
  };

  const calculateDominantCondition = (data) => {
    const conditions = data.map((entry) => entry.main);
    return conditions.sort(
      (a, b) =>
        conditions.filter((v) => v === a).length - conditions.filter((v) => v === b).length
    ).pop();
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const checkForAlerts = (data) => {
    const newAlerts = [];
    const breaches = { ...consecutiveBreaches };

    data.forEach((entry) => {
      const city = entry.city;
      const temp = entry.temp;

      if (!breaches[city]) {
        breaches[city] = 0;
      }

      if (temp > alertThreshold) {
        breaches[city] += 1;
      } else {
        breaches[city] = 0;
      }

      if (breaches[city] >= 2) {
        newAlerts.push({
          city,
          temp,
          condition: entry.main,
        });

        
        setSnackbarMessage(`Alert! ${city} has crossed the threshold with a temperature of ${temp}°C and condition: ${entry.main}`);
        setSnackbarOpen(true);
      }
    });

    setAlerts(newAlerts);
    setConsecutiveBreaches(breaches);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <Container className="App" maxWidth="md" sx={{ mt: 5, bgcolor: '#001f3f', color: '#ffffff', minHeight: '100vh', padding: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ mb: 5 }}>
        Real-Time Weather Monitoring & Forecast
      </Typography>

      <WeatherSummary summary={dailySummary} />

      <WeatherAlerts alerts={alerts} />

      <Grid container spacing={4} className="weather-container">
        {weatherData.length > 0 ? (
          weatherData.map((cityData, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <StyledCard
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                sx={{ bgcolor: 'rgba(0, 0, 0, 0.7)', color: '#ffffff' }} 
              >
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {cityData.city}
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    {cityData.main}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Temp: {cityData.temp}°C
                  </Typography>
                  <Typography variant="body2">
                    Feels Like: {cityData.feels_like}°C
                  </Typography>
                  <Typography variant="body2">
                    Humidity: {cityData.humidity}%
                  </Typography>
                  <Typography variant="body2">
                    Wind Speed: {cityData.wind_speed} m/s
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Last Updated: {formatTimestamp(cityData.timestamp)}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          ))
        ) : (
          <Grid item xs={12} align="center">
            <CircularProgress />
          </Grid>
        )}
      </Grid>

      <Typography variant="h4" align="center" gutterBottom sx={{ mt: 5 }}>
        5-Day Weather Forecast
      </Typography>
      <Grid container spacing={4}>
        {forecastData.length > 0 ? (
          forecastData.map((cityData, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <StyledCard
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                sx={{ bgcolor: 'rgba(0, 0, 0, 0.7)', color: '#ffffff' }}
              >
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {cityData.city} 5-Day Forecast
                  </Typography>
                  {cityData.forecast.map((forecast, i) => (
                    <div key={i} style={{ marginBottom: '20px' }}>
                      <Typography variant="body1">
                        Date: {new Date(forecast.dt * 1000).toLocaleDateString()}: {forecast.temp}°C
                      </Typography>
                      <Typography variant="body2">
                        Feels Like: {forecast.feels_like}°C, Humidity: {forecast.humidity}%, Wind: {forecast.wind_speed} m/s
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Forecast Time: {formatTimestamp(forecast.dt)}
                      </Typography>
                    </div>
                  ))}
                </CardContent>
              </StyledCard>
            </Grid>
          ))
        ) : (
          <Grid item xs={12} align="center">
            <CircularProgress />
          </Grid>
        )}
      </Grid>

      <footer style={{ marginTop: '30px', textAlign: 'center' }}>
        <Typography variant="caption" color="textSecondary">
          Powered by OpenWeatherMap
        </Typography>
      </footer>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="warning" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default App;
