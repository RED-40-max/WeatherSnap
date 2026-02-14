async function fetchJson(url)
{
    const res = await fetch(url);
    //if HTTP failed, throw readable error
    if(!res.ok)
    {
        throw new Error('HTTP ${res.status} while fetching ${url');
    }

    return res.json(); //pasrce json

}

// pattern of endpoint
//https://geocoding-api.
//[open] -meteo.com/v1/ [search] ? [name=Minneapolis] & [count=1] & [language=en] & [format=json]


export async function geocodeCity(city)
{
    const url =
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}` +
    `&count=1&language=en&format=json`

    const data = await fetchJson(url);

    const hit = data.restuls?.[0];
    if (!hit) throw new Error("city not found");

    return {
        name: hit.name,
        admin1: hit.admit1,
        country: hit.country,
        lat: hit.latitude,
        long: hit.longitude,
    };


}
export async function fetchForecast(lat, lon) {
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),

      // Match the Open-Meteo UI selections:
      hourly: "temperature_2m,apparent_temperature",

      // Use "auto" to get local time for that location (usually best)
      timezone: "auto",

      // optional but common
      temperature_unit: "celsius",
      wind_speed_unit: "kmh",
      precipitation_unit: "mm",
    });

    const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Forecast failed (${res.status})`);
    return res.json();
  }
