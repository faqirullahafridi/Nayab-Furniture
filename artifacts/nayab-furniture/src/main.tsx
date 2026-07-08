import { createRoot } from 'react-dom/client';

import App from './App';
import { hydrateCatalogCache } from '@/lib/catalog-cache';
import { queryClient } from '@/lib/query-client';

import './index.css';

hydrateCatalogCache(queryClient);

createRoot(document.getElementById('root')!).render(<App />);
