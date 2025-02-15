import React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './assets/js/ui/orders/App.jsx';
import { qs } from './assets/js/libs';



let root_el = qs('.root');

if (root_el) {
	const root = createRoot(root_el);
	root.render(<App />)
}




