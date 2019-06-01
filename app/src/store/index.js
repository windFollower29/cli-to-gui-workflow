
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import rootReducers from './reducers/index'

const middlewares = [ thunk ]

export default createStore(
  rootReducers,
  applyMiddleware(...middlewares)
)