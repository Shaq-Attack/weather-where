# Weather Where

A dashboard-style weather application built with React 18, TypeScript, and KendoReact. Displays current conditions, forecasts, air quality, and UV index in a clean, professional interface.

## Features

**Four views via the sidebar:**
- **Overview** — current conditions, environmental metrics, UV index gauge, and a 24-hour temperature/humidity chart
- **Forecast** — 7-day daily forecast with a clickable hourly breakdown per day
- **Hourly** — 24-hour forecast grid with temperature, precipitation chance, and wind
- **Details** — extended meteorological data and sunrise/sunset information

**Right panel widgets (overview only):**
- Air Quality Index with pollutant breakdown
- UV Index with risk level and protection advice
- Weather Insights with temperature trend, precipitation forecast, and wind advisory

**Other:**
- City selector with geolocation fallback
- Celsius / Fahrenheit toggle
- 10-minute client-side cache to avoid redundant API calls
- Responsive layout (right panel hidden on mobile)

## Tech Stack

| Category | Tools |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| UI components | KendoReact 11 (Material theme) |
| Charts | KendoReact Charts, Recharts |
| Icons | Lucide React |
| Testing | Vitest, React Testing Library, Playwright |
| Package manager | pnpm |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- OpenWeatherMap API key (free tier — [openweathermap.org](https://openweathermap.org/api))

### Setup

```bash
git clone https://github.com/Shaq-Attack/weather-where.git
cd weather-where
pnpm install
```

Create `.env.local` in the project root:

```env
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

```bash
pnpm dev
```

Open `http://localhost:5173`.

### Build

```bash
pnpm build        # type-check + Vite build → dist/
pnpm preview      # preview the production build locally
```

## Commands

```bash
pnpm dev              # development server
pnpm build            # production build
pnpm lint             # tsc --noEmit + Prettier check
pnpm lint:fix         # auto-fix formatting
pnpm type-check       # TypeScript validation only

pnpm test             # unit tests (watch mode)
pnpm test:ci          # unit tests (single run)
pnpm test:coverage    # coverage report

pnpm e2e              # Playwright E2E (headless)
pnpm e2e:headed       # Playwright E2E (browser visible)
```

Run a single test file:

```bash
pnpm vitest src/test/convertTemp.test.ts
```

## API Integration

All weather data uses **OpenWeatherMap free-tier (2.5) endpoints** only:

| Endpoint | Used for |
|---|---|
| `/data/2.5/weather` | Current conditions |
| `/data/2.5/forecast` | 5-day / 3-hour forecast (converted to daily and hourly) |
| `/data/2.5/air_pollution` | AQI and pollutant components |

UV index is sourced separately from **Open-Meteo** (`/v1/forecast?hourly=uv_index`) — no API key required.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_OPENWEATHER_API_KEY` | Yes | OpenWeatherMap API key |

## Project Structure

```
src/
├── api/
│   └── openWeather.ts          # API calls and response types
├── components/
│   ├── DashboardHeader.tsx     # Header with city dropdown and unit toggle
│   ├── DashboardLayout.tsx     # Four-slot layout shell
│   ├── DashboardSidebar.tsx    # View navigation
│   ├── DashboardWidgets.tsx    # Right panel container
│   └── weather/                # Weather feature components
│       ├── AirQualityCard.tsx
│       ├── ForecastCard.tsx
│       ├── ForecastScreen.tsx
│       ├── HourlyGrid.tsx
│       ├── HourlyScreen.tsx
│       ├── UVIndexCard.tsx
│       ├── WeatherCard.tsx
│       ├── WeatherDashboardCards.tsx
│       ├── WeatherDetailsScreen.tsx
│       └── WeatherInsights.tsx
├── hooks/
│   ├── useGeolocation.ts
│   ├── useLocalStorage.ts
│   └── useWeather.ts           # Fetches + caches WeatherData
├── utils/
│   ├── convertTemp.ts
│   ├── time.ts
│   └── weather.ts              # Condition normalisation, gradients, UV/AQI levels
└── test/
    ├── setup.ts
    ├── convertTemp.test.ts
    └── useLocalStorage.test.ts
```

## Deployment

### Vercel

1. Connect the repository in Vercel.
2. Add `VITE_OPENWEATHER_API_KEY` in the project environment variables.
3. Deploy — the default build settings (`pnpm build`, output `dist`) work without configuration.

### Other hosts

Build with `pnpm build` and serve the `dist` directory as a static site.

### CI

`.github/workflows/ci-cd.yml` runs tests and a production build on every push.

## License

MIT — see [LICENSE](./LICENSE).
