import React from 'react';
import { render } from 'react-dom';
import {
  configureStore,
  getDefaultMiddleware,
} from '@redux-ts-starter-kit/core';
import { createLogger } from 'redux-logger';
import { Provider } from 'react-redux';
import App from './containers/App';
import { postsBySubreddit, selectedSubreddit } from './reducers';

const middleware =
  process.env.NODE_ENV !== 'production'
    ? [...getDefaultMiddleware(), createLogger(),]
    : getDefaultMiddleware();

export interface IStore {
  postsBySubreddit: ReturnType<typeof postsBySubreddit>;
  selectedSubreddit: ReturnType<typeof selectedSubreddit>;
}

const [store,] = configureStore<IStore>({
  reducer: {
    postsBySubreddit,
    selectedSubreddit,
  },
  middleware,
});

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
