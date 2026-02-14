import { CONFIG } from "./config.js";

export function safeCity(s) {
  return (s || "").trim();
}

export function formatLocation(geo) {
  const admin = geo.admin1 ? `, ${geo.admin1}` : "";
  return `${geo.name}${admin} (${geo.country})`;
}

export function takeFirstHours(forecastJson) {
  const times = forecastJson.hourly?.time || [];
  const temps = forecastJson.hourly?.temperature_2m || [];
  const n = Math.min(CONFIG.MAX_HOURS, times.length, temps.length);

  const labels = [];
  const values = [];

  for (let i = 0; i < n; i++) {
    // dayjs is loaded globally via CDN
    labels.push(dayjs(times[i]).format("ha"));
    values.push(temps[i]);
  }

  return { labels, values };
}
