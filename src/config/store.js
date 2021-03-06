import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { createMigrate, persistReducer, persistStore } from 'redux-persist';
import createSensitiveStorage from 'redux-persist-sensitive-storage';
import uuid from 'react-native-uuid';
import { defaultState, rootReducer } from './reducer';

const migrations = {
  0: state => ({
    ...state,
    availableTokens: state.availableTokens.map(token => ({
      ...token,
      id: uuid.v4(),
    })),
  }),
};

const storage = createSensitiveStorage({
  encrypt: true,
  keychainService: 'eltwallet',
  sharedPreferencesName: 'eltwallet',
});

const config = {
  key: 'eltwallet',
  version: 1,
  storage,
  migrate: createMigrate(migrations, { debug: false }),
};

const store = createStore(
  persistReducer(config, rootReducer),
  defaultState,
  process.env.NODE_ENV === 'production'
    ? undefined
    : applyMiddleware(createLogger()),
);

const getPersistor = cb => persistStore(store, null, cb);

export { getPersistor, store };
