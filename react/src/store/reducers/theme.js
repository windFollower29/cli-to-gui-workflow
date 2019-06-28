

import { REHYDRATE } from 'redux-persist/lib/constants'

import { SET_THEME } from '../action-types'

export default (state = '', action) => {

  switch (action.type) {

    case SET_THEME:
      return action.path

    case REHYDRATE:
      return state

    default: 
      return state
  }
}