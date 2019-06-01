
import * as types from '../action-types'

/**
 * 一个项目的数据模板
 * @param {String} id id of project
 * @param {Array} actions scripts in package.json
 * @param {Array} xterms Array of instances of xterm
 * @param {String} cwd root path of the project, as well as, default path of teminal
 * @param {String} idShown id of the active terminal
 */
const model = (id, name, actions, xterms, cwd, idShown) => ({
  id,
  name,
  actions,
  xterms,
  cwd,
  idShown
})

export const addProject = (project) => {

  return {
    type: types.addProject,
    project
  }
}