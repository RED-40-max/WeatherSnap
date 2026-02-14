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

export async function fetchForecast(lat, long)
{
    const url =   `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&hourly=temperature_2m&temperature_unit=celsius&timezone=auto`;
    return fetchJson(url);
}