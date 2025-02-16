import { useState, useEffect } from 'react';

interface TabData {
  url: string;
  title: string;
  timestamp: string;
}

export default function App() {
  const [tabHistory, setTabHistory] = useState<TabData[]>([]);

  useEffect(() => {
    // Check if Chrome APIs are available
    if (typeof chrome !== 'undefined' && chrome.storage) {
      // Load initial data
      chrome.storage.local.get(['tabHistory'], (result) => {
        setTabHistory(result.tabHistory || []);
      });

      // Listen for changes
      const storageListener = (changes: {[key: string]: chrome.storage.StorageChange}) => {
        if (changes.tabHistory) {
          setTabHistory(changes.tabHistory.newValue);
        }
      };

      chrome.storage.onChanged.addListener(storageListener);

      // Cleanup listener on unmount
      return () => {
        chrome.storage.onChanged.removeListener(storageListener);
      };
    }
  }, []);

  // Show message if Chrome APIs are not available
  if (typeof chrome === 'undefined' || !chrome.storage) {
    return (
      <div className="w-96 p-4">
        <p className="text-red-500">This app only works as a Chrome extension.</p>
      </div>
    );
  }

  return (
    <div className="w-96 p-4">
      <h1 className="text-xl font-bold mb-4">Recent Tab History</h1>
      <div className="space-y-2">
        {tabHistory.slice().reverse().map((tab, index) => (
          <div key={index} className="p-2 border rounded hover:bg-gray-50">
            <div className="font-medium truncate">{tab.title}</div>
            <div className="text-sm text-gray-500 truncate">{tab.url}</div>
            <div className="text-xs text-gray-400">
              {new Date(tab.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
