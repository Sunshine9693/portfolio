import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPortfolioData = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('/api/content');
      if (res.data?.success && res.data?.data) {
        setData(res.data.data);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to fetch portfolio data:', err);
      setError(err.message || 'Failed to load portfolio content.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const updateSectionData = async (section, updatedData, token) => {
    try {
      const res = await axios.put(
        '/api/content/section',
        { section, data: updatedData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.success) {
        setData(prev => ({
          ...prev,
          [section]: res.data.data
        }));
        return { success: true };
      }
      return { success: false, message: res.data?.message || 'Update failed' };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  return (
    <PortfolioContext.Provider value={{ data, isLoading, error, refreshData: fetchPortfolioData, updateSectionData }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
