This project is a Real-Time Weather Monitoring System built using React.js and Material-UI that fetches real-time weather data from the OpenWeatherMap API. It processes and displays weather data such as temperature, feels-like temperature, and the main weather condition for specific cities. The system also provides daily weather summaries with rollups and aggregates, as well as configurable weather alerts for specific thresholds.

Features
Real-time Weather Data:

Fetches current weather conditions such as temperature, feels-like temperature, and weather condition (e.g., Clear, Rain, Snow) from the OpenWeatherMap API for major Indian cities.

Daily Weather Summary:
Displays rollup and aggregates for the day, including:
Average temperature
Maximum temperature
Minimum temperature
Dominant weather condition
Weather Alerts:

User-configurable alert thresholds based on temperature.
Alerts when the temperature exceeds a defined threshold (e.g., 35°C) in a interval of 5 minutes but user has to first set the threshold and update that.

Responsive Design:
The UI is responsive and visually appealing, built using Material-UI components for a modern look and feel.
Animations are used to enhance the user experience.
Visual Components:

Weather data cards showing real-time temperature, feels-like temperature, and weather condition.
Weather summary displays key statistics for the day.
Alerts are shown when weather conditions breach user-defined thresholds.

Demo : 

Installation
To run the project locally, follow the steps below:

Prerequisites
Node.js 
npm 

->Setup
Clone the repository:

* git clone https://github.com/21BCS035/Real-time-weather-monitoring.git
* cd weather-monitoring-system

->Install the dependencies:
npm install
npm i axios
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install framer-motion 

Start the development server:
* npm start

