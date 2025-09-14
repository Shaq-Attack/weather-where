import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../hooks/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return initial value when no stored value exists', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    expect(result.current[0]).toBe('initial');
  });

  it('should set value in localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'test-key',
      expect.stringContaining('new-value')
    );
  });

  it('should remove value from localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[2](); // removeValue function
    });

    expect(result.current[0]).toBe('initial');
    expect(localStorage.removeItem).toHaveBeenCalledWith('test-key');
  });

  it('should handle TTL expiration', () => {
    const mockGetItem = vi.mocked(localStorage.getItem);
    const expiredItem = JSON.stringify({
      value: 'expired-value',
      timestamp: Date.now() - 1000, // 1 second ago
      ttl: 500, // 500ms TTL
    });
    
    mockGetItem.mockReturnValue(expiredItem);
    
    const { result } = renderHook(() => 
      useLocalStorage('test-key', 'initial', { ttl: 500 })
    );
    
    expect(result.current[0]).toBe('initial');
  });
});
