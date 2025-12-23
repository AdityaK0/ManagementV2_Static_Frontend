'use client';

import { createContext, useContext } from 'react';

const PortfolioContext = createContext({
  portfolio: null,
  slug: null,
  isLoading: true,
});

export const PortfolioProvider = ({ children, portfolio, slug, isLoading }) => {
  return (
    <PortfolioContext.Provider value={{ portfolio, slug, isLoading }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolioContext = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolioContext must be used within PortfolioProvider');
  }
  return context;
};

