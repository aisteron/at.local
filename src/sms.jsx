import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'

import { App } from './assets/js/ui/sms/App.jsx';
import { store } from './assets/js/ui/sms/store'
import { qs } from './assets/js/libs';



let sms = qs('#sms_order_modal');
if (sms) {
	const root = createRoot(sms);
	root.render(
		<Provider store={store}>
			<App />
		</Provider>
	)
}




