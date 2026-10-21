/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store } from './src/Redux/store';
import persistStore from 'redux-persist/es/persistStore';


const persistor = persistStore(store);
AppRegistry.registerComponent(appName, () => () => (
    <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
            <App/>
        </PersistGate>
    </Provider>
));
