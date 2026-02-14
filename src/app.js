import { geocodeCity, fetchForecast } from "./api.js";
import { safeCity, formatLocation, takeFirstHours } from "./utils.js";

const cityInput = document.getElementById("cityInput");
const goBtn = document.getElementById("goBtn");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const locEl = document.getElementById("loc");
const tempEl = document.getElementById("temp");

let chart; // Chart.js instance

function setStatus(msg) {
  statusEl.textContent = msg || "";
}

function showResult(show) {
  resultEl.classList.toggle("hidden", !show);
}

function renderChart(labels, temps) {
  const ctx = document.getElementById("chart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{ label: "Temp (°C)", data: temps, tension: 0.35 }],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { ticks: { callback: (v) => `${v}°` } },
      },
    },
  });
}

/** Always have a working “demo state” even if APIs fail */
function renderFakeDemo() {
  const labels = Array.from({ length: 12 }, (_, i) =>
    dayjs().add(i, "hour").format("ha")
  );
  const temps = [20, 21, 22, 22, 23, 24, 24, 23, 22, 21, 21, 20];

  locEl.textContent = "Demo City (XX)";
  tempEl.textContent = `${temps[0]} °C`;
  renderChart(labels, temps);
  showResult(true);
}

async function onGo() {
  const city = safeCity(cityInput.value) || "Minneapolis";
  goBtn.disabled = true;
  setStatus("Loading…");
  showResult(false);

  try {
    const geo = await geocodeCity(city);
    const forecast = await fetchForecast(geo.lat, geo.lon);

    const { labels, values } = takeFirstHours(forecast);
    if (values.length === 0) throw new Error("No hourly data returned");

    locEl.textContent = formatLocation(geo);
    tempEl.textContent = `${values[0]} °C`;

    renderChart(labels, values);
    showResult(true);
    setStatus("");
  } catch (err) {
    setStatus(`Error: ${err?.message || "Unknown issue"} (showing demo data)`);
    renderFakeDemo();
  } finally
  {
    goBtn.disabled = false;
  }
}

goBtn.addEventListener("click", onGo);
cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") onGo();
});

// Start with something that always works
renderFakeDemo();
