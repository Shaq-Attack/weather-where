# Weather Where

A professional, dashboard-style weather application built with React, TypeScript, and KendoReact components. Experience comprehensive weather data through a modern, intuitive interface with real-time updates and advanced analytics.

![Weather Where App](./screenshots/app-preview.png)

## 🌟 Features

### 🏠 **Dashboard Overview**
- **Unified Weather Dashboard**: Single-card interface displaying current conditions, forecasts, and key metrics
- **Interactive Weather Map**: Visual weather patterns and conditions
- **Quick Stats Grid**: Temperature, humidity, pressure, and wind speed at a glance
- **Weather Insights**: AI-powered weather tips and recommendations

### 📊 **Multi-View Navigation**
- **Overview**: Complete weather dashboard with all essential information
- **Forecast**: 7-day detailed weather predictions with daily breakdowns
- **Hourly**: Comprehensive hourly data with advanced filtering and sorting
- **Details**: In-depth weather analytics and extended meteorological data

### 🎛️ **Advanced Features**
- **Professional Header**: Search locations, city selection, and temperature unit toggle
- **Smart Sidebar Navigation**: Seamless switching between different weather views
- **Widget Panel**: Air quality index, UV index, and weather insights widgets
- **Real-time Updates**: Live weather data with intelligent caching
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Accessibility**: WCAG AA compliant with full keyboard navigation and screen reader support

## 🛠️ Tech Stack

### 🎯 **Core Technologies**
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: KendoReact 11+ (15+ professional components)
- **Icons**: Lucide React (modern icon system)
- **Charts**: Recharts + KendoReact Charts
- **Styling**: KendoReact Material Theme + Custom Gradients

### 🧪 **Development & Testing**
- **Testing**: Vitest (unit) + React Testing Library + Playwright (E2E)
- **Code Quality**: TypeScript strict mode + Prettier formatting
- **Build Tool**: Vite with optimized bundling and HMR
- **Package Manager**: pnpm for efficient dependency management

### 🌐 **APIs & Data**
- **Weather Data**: OpenWeatherMap API (current + forecast + air quality)
- **Geolocation**: Browser Geolocation API with fallback
- **Caching**: localStorage with TTL for performance optimization

## 🎨 KendoReact Components Used

This professional weather dashboard showcases 15+ KendoReact components across multiple packages:

### 🧩 **Core Components**
1. **AppBar/AppBarSection/AppBarSpacer** - Professional dashboard header with navigation controls
2. **Card/CardHeader/CardBody/CardTitle/CardSubtitle** - Weather information containers and data cards
3. **DropDownList** - City and location selection with search functionality
4. **Switch** - Temperature unit toggle (°C/°F) with smooth animations
5. **TextBox** - Location search with real-time filtering
6. **Button** - Interactive action buttons throughout the interface

### 📊 **Data & Navigation Components**
7. **TabStrip/TabStripTab** - Multi-view navigation (Overview, Forecast, Hourly, Details)
8. **Dialog** - Weather detail modals and information popups
9. **Loader** - Loading states for data fetching and transitions
10. **Notification** - Error handling and success messages
11. **Tooltip** - Contextual help and additional information overlays

### 📈 **Advanced Widgets**
12. **Charts** - Weather data visualization and trend analysis
13. **Gauges** - Air quality and UV index indicators
14. **Progressbars** - Sun position and daily progress tracking
15. **Indicators** - Real-time weather status and alerts
16. **Grid** - Comprehensive hourly weather data tables (optional enhanced view)

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** and **pnpm** (recommended package manager)
- **OpenWeatherMap API key** (free tier available at openweathermap.org)
- **Modern browser** with JavaScript enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shaq-Attack/weather-where.git
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
   Navigate to `http://localhost:5173` to view the dashboard

### Quick Start Options

**Using npm:**
```bash
npm install && npm run dev
```

**Using yarn:**
```bash
yarn install && yarn dev
```

### Building for Production

```bash
pnpm build
```

The built files will be in the `dist` directory.

## 🧪 Testing

### Unit Tests (Vitest + React Testing Library)
```bash
pnpm test              # Run tests once
pnpm test:watch        # Run tests in watch mode
pnpm test:ui           # Run tests with UI interface
```

### Integration Tests (Playwright)
```bash
pnpm e2e               # Run E2E tests headless
pnpm e2e:headed        # Run E2E tests with browser
pnpm e2e:ui            # Run E2E tests with Playwright UI
```

### Code Quality & Coverage
```bash
pnpm test:coverage     # Generate test coverage report
pnpm lint              # Run TypeScript and Prettier checks
pnpm lint:fix          # Auto-fix formatting issues
pnpm type-check        # Validate TypeScript compilation
```

### Test Structure
- **Unit Tests**: `src/test/*.test.ts` - Component and utility function tests
- **E2E Tests**: `e2e/*.spec.ts` - Full application workflow tests
- **Setup**: `src/test/setup.ts` - Test environment configuration

## 🌐 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_OPENWEATHER_API_KEY` | OpenWeatherMap API key for weather data | Yes | - |
| `NODE_ENV` | Application environment | No | `development` |

## 📱 API Integration

### OpenWeatherMap API
- **Current Weather**: `/data/2.5/weather`
- **Forecast**: `/data/2.5/forecast` (fallback) or `/data/3.0/onecall` (preferred)
- **Rate Limiting**: Respects API limits with caching
- **Error Handling**: Graceful fallbacks and user-friendly error messages

### Additional APIs
- **Air Quality**: Real-time air pollution data integration
- **UV Index**: Sun exposure and safety recommendations
- **Weather Insights**: Intelligent weather analysis and tips

## ♿ Accessibility Features

- **Keyboard Navigation**: Complete keyboard support for dashboard navigation and all interactive elements  
- **Screen Reader Support**: Comprehensive ARIA labels, semantic HTML, and descriptive content
- **Focus Management**: Enhanced focus indicators with smooth transitions and logical tab sequences
- **Color Contrast**: WCAG AA compliant color schemes with gradient backgrounds
- **Responsive Design**: Scalable fonts, adaptive layouts, and mobile-optimized interfaces
- **Alternative Content**: Descriptive labels for weather icons, charts, and visual elements
- **Navigation Aids**: Clear section headings, landmark regions, and skip navigation links

## 🎯 Performance Features

- **Smart Caching**: Intelligent 10-minute TTL for weather data with localStorage persistence
- **Component Optimization**: Lazy loading and code splitting for faster initial page loads
- **Error Boundaries**: Comprehensive error handling with graceful fallbacks
- **API Management**: Rate limiting, retry logic with exponential backoff, and request queuing
- **Bundle Optimization**: Advanced tree shaking, code splitting, and asset optimization
- **Dashboard Efficiency**: Virtualized scrolling for large data sets and optimized re-renders
- **Memory Management**: Proper cleanup of subscriptions and event listeners

## 🏗️ Architecture

```
src/
├── api/                           # API integration layer
│   └── openWeather.ts            # Weather API client with caching
├── components/                    # React components
│   ├── DashboardHeader.tsx       # Professional app header with search & controls
│   ├── DashboardLayout.tsx       # Main layout container with responsive design
│   ├── DashboardSidebar.tsx      # Navigation sidebar with view switching
│   ├── DashboardWidgets.tsx      # Widget panel container for additional insights
│   └── weather/                  # Weather-specific components
│       ├── AirQualityCard.tsx    # Air pollution data widget
│       ├── Background.tsx        # Dynamic weather backgrounds
│       ├── ForecastCard.tsx      # Daily weather forecasts
│       ├── ForecastScreen.tsx    # Full forecast view
│       ├── HourlyGrid.tsx        # Detailed hourly data table
│       ├── HourlyScreen.tsx      # Hourly weather view
│       ├── SunProgressBar.tsx    # Sunrise/sunset visualization
│       ├── UVIndexCard.tsx       # UV index monitoring widget
│       ├── WeatherAppBar.tsx     # Weather-specific navigation
│       ├── WeatherCard.tsx       # Current weather display card
│       ├── WeatherDashboardCards.tsx # Unified dashboard interface
│       ├── WeatherDetailsScreen.tsx  # Comprehensive weather details
│       └── WeatherInsights.tsx   # AI-powered weather recommendations
├── hooks/                        # Custom React hooks
│   ├── useGeolocation.ts        # GPS location detection
│   ├── useWeather.ts            # Weather data management & caching
│   └── useLocalStorage.ts       # Persistent client-side storage
├── utils/                        # Utility functions
│   ├── components.tsx           # Reusable UI components
│   ├── convertTemp.ts           # Temperature unit conversions
│   ├── styleComponents.tsx      # Styled component utilities
│   ├── styles.ts               # Theme and styling constants
│   ├── time.ts                 # Date/time formatting utilities
│   └── weather.ts              # Weather data processing
└── test/                        # Test suites
    ├── setup.ts                # Test environment configuration
    ├── *.test.ts              # Unit tests
    └── *.spec.ts              # End-to-end integration tests
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
- Validates TypeScript compilation and code formatting

## 🎨 Dashboard Interface

### Layout System
The application uses a sophisticated three-panel layout:

- **Header Panel**: Global navigation, search, and controls
- **Left Sidebar**: Main navigation with weather view switching  
- **Main Content**: Dynamic content area based on selected view
- **Right Panel**: Contextual widgets and additional insights (shown on Overview)

### View Navigation
- **Overview** (`/overview`): Unified weather dashboard with complete weather information
- **Forecast** (`/forecast`): 7-day detailed weather predictions
- **Hourly** (`/hourly`): Comprehensive hourly weather data grid
- **Details** (`/details`): In-depth meteorological analytics

### Widget System
The right panel features modular widgets:
- **Air Quality Card**: Real-time air pollution monitoring
- **UV Index Card**: Sun exposure recommendations
- **Weather Insights**: AI-powered tips and weather guidance

## 🔧 Configuration

### Vite Configuration
- TypeScript support
- React plugin
- Testing setup with Vitest
- Build optimizations

### Theme Customization
The app uses KendoReact's Material theme with custom gradient accents. To customize:

1. **Modify theme imports** in `src/main.tsx` and component files
2. **Override CSS variables** in component styles using the `dangerouslySetInnerHTML` pattern
3. **Adjust gradient backgrounds** in dashboard cards and header components
4. **Customize color schemes** through the centralized gradient system (`#667eea` to `#764ba2`)

### Dashboard Customization
- **Widget Layout**: Modify `DashboardWidgets.tsx` to add or remove right-panel widgets
- **Navigation**: Update `DashboardSidebar.tsx` to add new views or sections
- **Header Controls**: Customize `DashboardHeader.tsx` for additional functionality

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- **KendoReact** for the comprehensive professional UI component library
- **OpenWeatherMap** for reliable, real-time weather data and forecasting
- **Lucide React** for the modern, scalable icon system
- **Recharts** for beautiful data visualization and charting capabilities
- **Vite** for the blazing-fast development and build tooling
- **TypeScript** for type safety and enhanced developer experience

## 📞 Support

If you encounter any issues or have questions:

1. Check the [documentation](#-getting-started)
2. Search [existing issues](../../issues)
3. Create a [new issue](../../issues/new) with detailed information

---

Built with ❤️ for the KendoReact Developer Contest
