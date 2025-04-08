import React from 'react';
import { createRoot } from 'react-dom/client'
import './index.css'
import AppContent from './App.tsx'
import { Provider } from 'react-redux';
import { store } from './store/store';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
  <AppContent />
</Provider>
)
