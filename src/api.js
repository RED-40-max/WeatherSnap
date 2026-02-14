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
      `&count=1&language=en&format=json`;

    const data = await fetchJson(url);

    const hit = data.results?.[0];
    if (!hit) throw new Error("City not found");

    return {
      name: hit.name,
      admin1: hit.admin1,
      country: hit.country,
      lat: hit.latitude,
      lon: hit.longitude,
    };
  }

  export async function fetchForecast(lat, lon) {
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      hourly: "temperature_2m,apparent_temperature",
      timezone: "auto",
      temperature_unit: "celsius",
      wind_speed_unit: "kmh",
      precipitation_unit: "mm",
    });

    const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
    return fetchJson(url);
  }
