// src/api.js

async function fetchJson(url) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} while fetching ${url}`);
    }
    return res.json();
  }

  export async function geocodeCity(city) {


    const url =
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}` +
      `&count=5&language=en&format=json`;

      console.log("Geocode URL:", url);
      const data = await fetchJson(url);
      console.log("Geocode response:", data);

    const hit = data.results?.[0];
    if (!hit) throw new Error("Place not found — try a city like Tokyo, Osaka, or Sapporo.");

    return {
      name: hit.name,
      admin1: hit.admin1,
      country: hit.country,
      lat: hit.latitude,
      lon: hit.longitude,
    };
  }

  export function takeFirstHours(forecastJson, n = 12) {
    const times = forecastJson.hourly?.time || [];
    const temp = forecastJson.hourly?.temperature_2m || [];
    const feels = forecastJson.hourly?.apparent_temperature || [];

    const k = Math.min(n, times.length, temp.length, feels.length);

    const labels = [];
    const tempVals = [];
    const feelsVals = [];

    for (let i = 0; i < k; i++) {
      labels.push(dayjs(times[i]).format("ha"));
      tempVals.push(temp[i]);
      feelsVals.push(feels[i]);
    }


    return { labels, tempVals, feelsVals };
  }
