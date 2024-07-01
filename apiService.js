const axios = require('axios');

class NetworkService {
    constructor(geoapifyApiKey, weatherApiKey) {
      this.geoapifyApiKey = geoapifyApiKey;
      this.weatherApiKey = weatherApiKey;
    }
  
    async fetchUserLocation(clientIp) {
      try {
        const response = await axios.get(`https://api.geoapify.com/v1/ipinfo?ip=${clientIp}&apiKey=${this.geoapifyApiKey}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching location data:', error);
        throw new Error('Unable to fetch location data');
      }
    }
  
    async fetchWeather(city) {
      try {
        const response = await axios.get(`https://api.weatherapi.com/v1/current.json?q=${city}&key=${this.weatherApiKey}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching weather data:', error);
        throw new Error('Unable to fetch weather data');
      }
    }
  }

  module.exports = NetworkService;