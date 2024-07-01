require("dotenv").config({ path: `${process.cwd()}/.env` });
const express = require("express");
const NetworkService = require("../apiService");

const app = express();

const port = process.env.PORT || 3000;
app.set('trust proxy', true);

app.use(express.json());

const geoApiKey = process.env.GEO_API_KEY;
const weatherApiKey = process.env.WEATHER_API_KEY;

const networkService = new NetworkService(geoApiKey, weatherApiKey);

app.get("/api/hello", async (req, res) => {
  try {
    const visitorName = req.query.visitor_name;
    const clientIp = (req.headers['x-forwarded-for'] as string) || 'IP not available';
    console.log('Full x-forwarded-for header:', clientIp);

    if (!visitorName) {
      return res.status(400).json({
        status: "fail",
        message: "Wrong query, please use 'visitor_name'",
      });
    }

    const userLocation = await networkService.fetchUserLocation(clientIp);
    const userWeather = await networkService.fetchWeather(
      userLocation.city.names.en
    );

    return res.status(200).json({
      client_ip: clientIp,
      location: userLocation.city.names.en,
      message: `Hello ${visitorName}! The temperature is ${userWeather.current.temp_c} celcius in ${userLocation.city.names.en}.`,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
});

app.use("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: "opps.., you might have hit a wrong endpoint,'try/api/hello?visitor_name=yourname'",
  });
});

app.listen(port, () => {
    console.log(`server is running at ${port}`);
  });

module.exports = app;