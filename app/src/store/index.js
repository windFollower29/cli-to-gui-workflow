
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import rootReducers from './reducers/index'

const middlewares = [ thunk ]

const store = createStore(
  rootReducers,
  applyMiddleware(...middlewares)
)

window.store = store

export default store