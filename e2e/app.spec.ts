import { test, expect } from '@playwright/test';

test.describe('Weather & Wonders App', () => {
  test.beforeEach(async ({ page, context }) => {
    // Mock geolocation to a known location (London)
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 51.5074, longitude: -0.1278 });
    
    // Mock the weather API response
    await page.route('**/api.openweathermap.org/data/2.5/weather*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          name: 'London',
          main: {
            temp: 20,
            feels_like: 22,
            temp_min: 18,
            temp_max: 24,
            humidity: 65
          },
          weather: [{
            main: 'Clear',
            description: 'clear sky',
            icon: '01d'
          }],
          wind: { speed: 3.5 },
          sys: {
            country: 'GB',
            sunrise: 1609459200,
            sunset: 1609495200
          }
        })
      });
    });

    // Mock the forecast API response
    await page.route('**/api.openweathermap.org/data/2.5/forecast*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          list: Array(40).fill(null).map((_, i) => ({
            dt: Date.now() / 1000 + (i * 3600 * 3), // Every 3 hours
            main: {
              temp: 20 + Math.sin(i / 8) * 5,
              feels_like: 22 + Math.sin(i / 8) * 5,
              temp_min: 18 + Math.sin(i / 8) * 5,
              temp_max: 24 + Math.sin(i / 8) * 5,
              humidity: 65
            },
            weather: [{
              main: 'Clear',
              description: 'clear sky',
              icon: '01d'
            }],
            wind: { speed: 3.5 },
            pop: 0.1
          })),
          city: { timezone: 0 }
        })
      });
    });

    // Mock Wikipedia API
    await page.route('**/en.wikipedia.org/api/rest_v1/page/summary/*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          title: 'London',
          extract: 'London is the capital and largest city of England and the United Kingdom. Standing on the River Thames in south-east England, at the head of a 50-mile estuary down to the North Sea, it has been a major settlement for two millennia.',
          thumbnail: {
            source: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/London_Montage_L.jpg/320px-London_Montage_L.jpg',
            width: 320,
            height: 240
          }
        })
      });
    });
  });

  test('should load and display weather information', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the app to load
    await expect(page.getByText('Weather & Wonders')).toBeVisible();
    
    // Check that weather card loads
    await expect(page.getByText('London')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('20°C')).toBeVisible();
    await expect(page.getByText('clear sky')).toBeVisible();
  });

  test('should toggle temperature units', async ({ page }) => {
    await page.goto('/');
    
    // Wait for weather to load
    await expect(page.getByText('20°C')).toBeVisible({ timeout: 10000 });
    
    // Click the temperature toggle switch
    await page.locator('.k-switch').click();
    
    // Should now show Fahrenheit
    await expect(page.getByText('68°F')).toBeVisible();
  });

  test('should display forecast information', async ({ page }) => {
    await page.goto('/');
    
    // Wait for forecast to load
    await expect(page.getByText('Weather Forecast')).toBeVisible({ timeout: 10000 });
    
    // Check that daily forecast is visible
    await expect(page.getByText('Daily Forecast')).toBeVisible();
    await expect(page.getByText('Today')).toBeVisible();
    
    // Switch to hourly forecast
    await page.getByText('Hourly Forecast').click();
    await expect(page.getByText('24-Hour Temperature Trend')).toBeVisible();
  });

  test('should display fun fact card', async ({ page }) => {
    await page.goto('/');
    
    // Wait for fun fact to load
    await expect(page.getByText('Did You Know?')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/London is the capital/)).toBeVisible();
    
    // Test regenerate button
    await page.getByText('New Fact').click();
    // Should show loading state briefly
    await expect(page.getByText('Loading...')).toBeVisible();
  });

  test('should display hourly data grid', async ({ page }) => {
    await page.goto('/');
    
    // Wait for hourly grid to load
    await expect(page.getByText('Detailed Hourly Forecast')).toBeVisible({ timeout: 10000 });
    
    // Check that the table has data
    await expect(page.locator('table tbody tr')).toHaveCount(20); // First page should have 20 rows
    
    // Test pagination
    await page.getByText('Next').click();
    await expect(page.getByText('Page 2')).toBeVisible();
  });

  test('should change city selection', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    await expect(page.getByText('Weather & Wonders')).toBeVisible();
    
    // Open city dropdown and select different city
    await page.locator('.k-dropdownlist').click();
    await page.getByText('Tokyo').click();
    
    // Should trigger new weather fetch (mocked response will still be London data)
    await expect(page.getByText('London')).toBeVisible({ timeout: 10000 });
  });

  test('should be accessible via keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Test keyboard navigation
    await page.keyboard.press('Tab'); // Focus on city dropdown
    await page.keyboard.press('Tab'); // Focus on temperature toggle
    await page.keyboard.press('Tab'); // Focus on forecast cards
    
    // Should be able to navigate forecast cards with keyboard
    await page.keyboard.press('Enter');
    
    await expect(page.getByText('Weather Forecast')).toBeVisible();
  });
});
