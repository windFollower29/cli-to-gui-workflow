
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import rootReducers from './reducers/index'

import { persistStore, persistReducer } from 'redux-persist'
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import storage from 'redux-persist/lib/storage'
// import createElectronStorage from "redux-persist-electron-storage"
// import ElectronStore from 'electron-store'

import SetTransform from './transforms'
import { createFilter, createBlacklistFilter } from 'redux-persist-transform-filter'

// const electronStore = new ElectronStore()

const persistConfig = {
  key: 'project',
  storage,
  // storage: createElectronStorage({ electronStore }),
  // stateReconciler: hardSet,
  // stateReconciler: autoMergeLevel2,
  // whitelist: ['project'],
  transforms: [SetTransform]
}

const persistedReducer = persistReducer(persistConfig, rootReducers)

const middlewares = [
  thunk,
  logger
]

const store = createStore(
  persistedReducer,
  applyMiddleware(...middlewares)
)

const filter = createFilter(
  'project',
  ['activeId']
  // ['projects', 'activeXterm', ]
)

const persistor = persistStore(store, {
  // transforms: [
  //   filter
  // ]
})
// console.log('persistor', persistor, persistor.getState())
window.store = store

export default store
export { persistor }