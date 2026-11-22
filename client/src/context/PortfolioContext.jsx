import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import api, { isApiCancel } from '../services/api';

import { updatePortfolioCopy } from './portfolioCopy';

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const activeRequestRef = useRef(null);

  const fetchPortfolioData = useCallback(async () => {
    activeRequestRef.current?.abort();
    const controller = new AbortController();
    activeRequestRef.current = controller;

    try {
      setIsLoading(true);
      const res = await api.get('/api/content', { signal: controller.signal });
      if (res.data?.success && res.data?.data) {
        setData(updatePortfolioCopy(res.data.data));
      }
      setError(null);
    } catch (err) {
      if (isApiCancel(err)) return;
      console.error('Failed to fetch portfolio data:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load portfolio content.');
    } finally {
      if (activeRequestRef.current === controller) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchPortfolioData();
    return () => {
      activeRequestRef.current?.abort();
    };
  }, [fetchPortfolioData]);

  const updateSectionData = useCallback(async (section, updatedData, token) => {
    try {
      const res = await api.put(
        '/api/content/section',
        { section, data: updatedData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.success) {
        setData((prev) => ({
          ...(prev || {}),
          [section]: res.data.data,
        }));
        return { success: true };
      }
      return { success: false, message: res.data?.message || 'Update failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Update failed',
      };
    }
  }, []);

  const acceptPublishedMedia = useCallback((section, item) => {
    if (!['gallery', 'certificates'].includes(section) || !item?.id) return;
    setData(prev => ({ ...(prev || {}), [section]: [
      ...(prev?.[section] || []).filter(existing => existing.id !== item.id), item,
    ] }));
  }, []);

  return (
    <PortfolioContext.Provider
      value={{ data, isLoading, error, refreshData: fetchPortfolioData, updateSectionData, acceptPublishedMedia }}
    >
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
