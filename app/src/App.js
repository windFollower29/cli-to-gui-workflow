import React from 'react';

import { Provider } from 'react-redux'
import store from './store/index'

import './App.css';
import './style/page.styl'

import Layout from './pages/Layout'

function App() {
  return (

    <Provider store={store} >

      <div className="App">

        <Layout/>

      </div>
      
    </Provider>
  );
}

export default App;
