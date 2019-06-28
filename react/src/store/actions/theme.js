

import { SET_THEME } from '../action-types'

export const setTheme = (path) => {

  return {
    type: SET_THEME,
    path
  }
}