import { useState } from 'react';

/**
 * Typed localStorage hook with null safety.
 * @param {string} key - localStorage key
 * @param {*} defaultValue - default value if key doesn't exist
 * @returns {[value, setValue]} - state value and setter
 */
function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored === null) {
        return defaultValue;
      }
      return JSON.parse(stored);
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setStoredValue = (newValue) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      localStorage.setItem(key, JSON.stringify(valueToStore));
      setValue(valueToStore);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [value, setStoredValue];
}

export default useLocalStorage;
