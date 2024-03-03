import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SharedContextProps {
  typedText: string;
  setTypedText: React.Dispatch<React.SetStateAction<string>>;
  searchHistory: string[];
  addToSearchHistory: (term: string) => void;
  selectedTerm: string;
  setSelectedTerm: React.Dispatch<React.SetStateAction<string>>; 
}

const SharedContext = createContext<SharedContextProps | undefined>(undefined);

interface SharedProviderProps {
  children: ReactNode;
}

export const SharedProvider: React.FC<SharedProviderProps> = ({ children }) => {
  const [typedText, setTypedText] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string>('');

  const addToSearchHistory = (term: string) => {
    setSearchHistory((prevHistory) => [...prevHistory, term]);
  };

  return (
    <SharedContext.Provider value={{ typedText, setTypedText, searchHistory, addToSearchHistory, selectedTerm, setSelectedTerm }}>
      {children}
    </SharedContext.Provider>
  );
};

export const useSharedContext = () => {
  const context = useContext(SharedContext);
  if (!context) {
    throw new Error('useSharedContext must be used within a SharedProvider');
  }
  return context;
};