import { createRoot } from 'react-dom/client';
import './index.css';
import AppContent from './App.tsx';
import { Provider } from 'react-redux';
import { store } from './store/store';

import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
	<Provider store={store}>
		<BrowserRouter>
			<AppContent />
		</BrowserRouter>
	</Provider>
);
