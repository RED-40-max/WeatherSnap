import { CONFIG } from "./config.js";

export function safeCity(s) {
  return (s || "").trim();
}

export function formatLocation(geo) {
  const admin = geo.admin1 ? `, ${geo.admin1}` : "";
  return `${geo.name}${admin} (${geo.country})`;
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
