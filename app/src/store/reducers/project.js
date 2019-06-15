
import { REHYDRATE } from 'redux-persist/lib/constants'


import * as types from '../action-types'

const initState = {
  projects: [],
  activeId: undefined,
  activeXterm: null,
  isNew: false
  // activeXtermId: undefined
}

const project = (state = initState, action) => {
  // console.log('reducer', action.type, state.payload)

  switch (action.type) {

    case types.initProject:
      return {
        ...state,
        projects: action.projects,
        activeId: action.activeId,
        activeXterm: action.activeXterm,
        isNew: true
      }

    case types.addProject:
      return {
        ...state,
        projects: [
          ...state.projects,
          action.project
        ],
        activeId: action.project.id,
        activeXterm: action.project.xterms[0],
        isNew: true
        // activeXtermId: action.project.xterms[0].id
      }

    case types.switchProject:
      return {
        ...state,
        activeId: action.activeId,
        activeXterm: action.activeXterm,
        isNew: false
      }

    case types.delProject:

      return {
        ...state,
        projects: action.projects,
        // activeId: undefined,
        // activeXterm: null,
        // isNew: false
      }

    case types.addXterm:

      // const idx = state.projects.findIndex(p => p.id === action.pid)
      // const _projects = [ ...state.projects ]
      // _projects[idx].xterms.push(action.xterm)
      // _projects[idx].activeXtermId = action.xterm.id

      return {
        ...state,
        projects: action.projects,
        activeXterm: action.xterm,
        isNew: true
      }

    case types.switchXterm:

      return {
        ...state,
        activeXterm: action.xtermModel,
        isNew: false
      }

    case types.delXterm:

      return {
        ...state,
        projects: action.projects
      }

    case types.rename:
    case types.enableEdit:
      // console.log('---')
      return {
        ...state,
        projects: action.projects
      }

    case REHYDRATE:
      // console.log('REHYDRATE', action.payload, state)
      return state

    default:
      return { ...state }
  }
}

export default project