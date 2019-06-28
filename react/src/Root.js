import React from 'react';

import { Provider } from 'react-redux'
import store from './store/index'

import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from './store/index'
import { setTheme } from './store/actions/theme'

import './App.css';
import './style/page.styl'

import App from './App'

const { ipcRenderer } = window.require('electron')

function Root(props) {

  // ipcRenderer.on('selected-img', (e, files) => {
  //   // console.log(files)
  //   const imgPath = files[0]
  //   store.dispatch(setTheme(imgPath))

  // })

  // const appDom = document.querySelector('.App')
  // appDom && (
  //   appDom.style.backgroundImage = 
  //   // `url('file://${bg}')`
  //   "url('file://" + bg + "')"
  // )
  // console.log('bg', bg)

  // "url('file://" + bg + "')"
  // console.log('--theme-', props.theme)

  return (

    <Provider store={store} >
      <PersistGate
        loading={null}
        persistor={persistor}
      >
        <App />
      </PersistGate>
    </Provider>
  );
}

// store.subscribe(() => {
//   console.log('subscribe', store.getState())
//   App()
// })

export default Root;
