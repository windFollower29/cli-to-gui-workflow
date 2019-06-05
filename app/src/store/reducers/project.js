
import * as types from '../action-types'

const initState = {
  projects: [],
  activeId: undefined,
  activeXterm: null,
  isNew: false
  // activeXtermId: undefined
}

const project = (state = initState, action) => {

  switch (action.type) {

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

    default:
      return { ...state }
  }
}

export default project