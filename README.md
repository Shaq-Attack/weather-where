# Weather Where

A modern, accessible weather application built with React, TypeScript, and KendoReact components. Get current weather, detailed forecasts, and discover fun facts about cities around the world.

![Weather Where App](./screenshots/app-preview.png)

## 🌟 Features

- **Current Weather**: Real-time weather data with beautiful gradient backgrounds that match weather conditions
- **7-Day Forecast**: Daily weather predictions with expandable hourly breakdowns
- **Hourly Data Grid**: Detailed hourly weather data with pagination and sorting
- **Fun Facts**: Interesting Wikipedia-sourced facts about your current city
- **Temperature Units**: Toggle between Celsius and Fahrenheit
- **City Selection**: Choose from major cities worldwide or use your current location
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Accessibility**: WCAG AA compliant with keyboard navigation and screen reader support
- **Offline Caching**: Smart caching with TTL for improved performance

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: KendoReact (13+ free components used)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Styling**: KendoReact Default + Ocean Blue theme
- **Testing**: Vitest + React Testing Library + Playwright
- **APIs**: OpenWeatherMap + Wikipedia REST API

## 🎨 KendoReact Components Used

This project showcases 13+ free KendoReact components:

1. **AppBar** - Navigation header with app branding
2. **Card/CardHeader/CardBody/CardTitle** - Weather cards and containers
3. **DropDownList** - City selection dropdown
4. **Switch** - Temperature unit toggle (°C/°F)
5. **TabStrip/TabStripTab** - Daily/Hourly forecast tabs
6. **Dialog** - Weather detail popups
7. **Button** - Action buttons throughout the app
8. **Loader** - Loading indicators
9. **Notification** - Error and success messages
10. **TileLayout** - Responsive component layout
11. **Tooltip** - Hover hints and additional information
12. **Label** - Form labels and typography
13. **Grid/GridColumn** - Data table for hourly weather (replaced with custom table for compatibility)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- OpenWeatherMap API key (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd weather-where
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
pnpm build
```

The built files will be in the `dist` directory.

## 🧪 Testing

### Unit Tests
```bash
pnpm test
```

### E2E Tests
```bash
pnpm e2e
```

### Test Coverage
```bash
pnpm test:coverage
```

## 🌐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_OPENWEATHER_API_KEY` | OpenWeatherMap API key | Yes |

## 📱 API Integration

### OpenWeatherMap API
- **Current Weather**: `/data/2.5/weather`
- **Forecast**: `/data/2.5/forecast` (fallback) or `/data/3.0/onecall` (preferred)
- **Rate Limiting**: Respects API limits with caching
- **Error Handling**: Graceful fallbacks and user-friendly error messages

### Wikipedia API
- **Fun Facts**: `/api/rest_v1/page/summary/{city}`
- **Fallback Data**: Local curated facts when API is unavailable
- **Privacy**: Only sends city names, no user data

## ♿ Accessibility Features

- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Management**: Visible focus indicators and logical tab order
- **Color Contrast**: WCAG AA compliant color schemes
- **Responsive Text**: Scalable fonts and layouts
- **Alternative Text**: Descriptive alt text for all images

## 🎯 Performance Features

- **Smart Caching**: 10-minute TTL for weather data
- **Lazy Loading**: Components loaded on demand
- **Error Boundaries**: Graceful error handling
- **Retry Logic**: Automatic retry with exponential backoff
- **Optimized Bundles**: Code splitting and tree shaking

## 🏗️ Architecture

```
src/
├── api/                    # API integration layer
│   ├── openWeather.ts     # Weather API client
│   └── wiki.ts            # Wikipedia API client
├── components/            # React components
│   ├── WeatherCard.tsx    # Current weather display
│   ├── WeatherAppBar.tsx  # Navigation header
│   ├── ForecastCard.tsx   # Daily/hourly forecasts
│   ├── FunFactCard.tsx    # Wikipedia fun facts
│   └── HourlyGrid.tsx     # Detailed data table
├── hooks/                 # Custom React hooks
│   ├── useGeolocation.ts  # Location detection
│   ├── useWeather.ts      # Weather data management
│   └── useLocalStorage.ts # Persistent storage
├── utils/                 # Utility functions
│   ├── convertTemp.ts     # Temperature conversions
│   └── time.ts            # Date/time formatting
└── test/                  # Test files
    ├── setup.ts           # Test configuration
    ├── *.test.ts          # Unit tests
    └── *.spec.ts          # Integration tests
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard:
   - `VITE_OPENWEATHER_API_KEY`
3. **Deploy** - Vercel will automatically build and deploy

### Manual Deployment

1. **Build the project**
   ```bash
   pnpm build
   ```

2. **Deploy the `dist` folder** to your hosting provider

### GitHub Actions (Optional)

The project includes a basic CI/CD workflow in `.github/workflows/` that:
- Runs tests on pull requests
- Builds and deploys on merge to main
- Includes environment variable setup

## 🔧 Configuration

### Vite Configuration
- TypeScript support
- React plugin
- Testing setup with Vitest
- Build optimizations

### Theme Customization
The app uses KendoReact's Default theme with Ocean Blue accents. To customize:

1. **Modify theme imports** in `src/main.tsx`
2. **Override CSS variables** in component styles
3. **Adjust gradient backgrounds** in weather cards

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- **KendoReact** for the excellent UI component library
- **OpenWeatherMap** for reliable weather data
- **Wikipedia** for educational content
- **Lucide** for beautiful icons
- **Recharts** for data visualization

## 📞 Support

If you encounter any issues or have questions:

1. Check the [documentation](#-getting-started)
2. Search [existing issues](../../issues)
3. Create a [new issue](../../issues/new) with detailed information

---

Built with ❤️ for the KendoReact Developer Contest
