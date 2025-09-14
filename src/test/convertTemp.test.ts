import { describe, it, expect } from 'vitest';
import { convertTemp, formatTemperature, celsiusToFahrenheit, fahrenheitToCelsius } from '../utils/convertTemp';

describe('convertTemp', () => {
  it('should convert Celsius to Fahrenheit correctly', () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
    expect(celsiusToFahrenheit(100)).toBe(212);
    expect(celsiusToFahrenheit(-40)).toBe(-40);
  });

  it('should convert Fahrenheit to Celsius correctly', () => {
    expect(fahrenheitToCelsius(32)).toBe(0);
    expect(fahrenheitToCelsius(212)).toBe(100);
    expect(fahrenheitToCelsius(-40)).toBe(-40);
  });

  it('should return same value when converting to same unit', () => {
    expect(convertTemp(25, 'C', 'C')).toBe(25);
    expect(convertTemp(77, 'F', 'F')).toBe(77);
  });

  it('should convert between units using convertTemp function', () => {
    expect(convertTemp(0, 'C', 'F')).toBe(32);
    expect(convertTemp(32, 'F', 'C')).toBe(0);
  });

  it('should format temperature with unit', () => {
    expect(formatTemperature(25.7, 'C')).toBe('26°C');
    expect(formatTemperature(77.3, 'F')).toBe('77°F');
  });

  it('should format temperature without unit when specified', () => {
    expect(formatTemperature(25.7, 'C', false)).toBe('26');
    expect(formatTemperature(77.3, 'F', false)).toBe('77');
  });
});
