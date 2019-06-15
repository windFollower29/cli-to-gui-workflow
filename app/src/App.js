import React from 'react';

import { Provider } from 'react-redux'
import store from './store/index'

import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from './store/index'

import './App.css';
import './style/page.styl'

import Layout from './pages/Layout'

function App() {
  return (

    <Provider store={store} >
      <PersistGate
        loading={null}
        persistor={persistor}
      >
        <div className="App">

          <Layout/>

        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;
