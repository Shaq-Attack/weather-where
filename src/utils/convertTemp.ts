// Temperature conversion utilities
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

export function convertTemp(
  temp: number,
  fromUnit: "C" | "F",
  toUnit: "C" | "F",
): number {
  if (fromUnit === toUnit) return temp;

  if (fromUnit === "C" && toUnit === "F") {
    return celsiusToFahrenheit(temp);
  }

  if (fromUnit === "F" && toUnit === "C") {
    return fahrenheitToCelsius(temp);
  }

  return temp;
}

export function formatTemperature(
  temp: number,
  unit: "C" | "F",
  showUnit = true,
): string {
  const rounded = Math.round(temp);
  return showUnit ? `${rounded}°${unit}` : `${rounded}`;
}
