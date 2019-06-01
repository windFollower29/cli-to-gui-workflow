
import * as types from '../action-types'

const project = (state = [], action) => {

  switch (action.type) {

    case types.addProject:
      return [
        ...state,
        action.project
      ]

    default:
      return [ ...state ]
  }
}

export default project