import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import reducer from './reducer';

const persistedReducer = persistReducer({
  key: 'myreducer',
  storage: storage,
}, reducer)

export default function configureStore() {
  const store = createStore(persistedReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
  const persistor = persistStore(store);
  return { store, persistor };
}

// J'instaure la connexion au tools redux, et j'instaure le persistRedux pour garder le token lorsque je refresh 