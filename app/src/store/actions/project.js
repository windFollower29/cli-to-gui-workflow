
import store from '../index'
import * as types from '../action-types'

import { generate } from 'shortid'
import Xterm from '../../js/terminal'

const fs = window.require('fs')
const path = window.require('path')

/**
 * 一个项目的数据模板
 * @param {String} name name of project
 * @param {Array} actions scripts in package.json
 * @param {Array} xterms Array of instances of xterm
 * @param {String} cwd root path of the project, as well as, default path of teminal
 * @param {String} activeXtermId id of the active terminal
 */
const projectModel = (name, actions, xterms, cwd, activeXtermId) => ({
  id: generate(),
  name,
  actions,
  xterms,
  cwd,
  activeXtermId
})

const xtermModel = (id, cwd) => {

  const xterm = new Xterm({ cwd })

  return {
    id,
    cwd,
    xterm
  }
}

export const addProject = (jsonFile) => {

  const name = `项目${store.getState().project.projects.length + 1}`
  
  const { dir: cwd } = path.parse(jsonFile)
  const data = fs.readFileSync(jsonFile, 'utf8')
  // scripts of 'package.json' file
  const scripts = JSON.parse(data).scripts
  const actions = Object.keys(scripts).map(key => ({
    id: generate(),
    label: key,
    script: scripts[key]
  }))

  // list of instances of xterm
  const id = generate()
  
  const xterms = [
    xtermModel(id, cwd)
  ]

  const project = projectModel(name, actions, xterms, cwd, id)

  return {
    type: types.addProject,
    project
  }
}

export const switchProject = (project) => {

  const activeXterm = project.xterms.find(x => x.id === project.activeXtermId)

  return {
    type: types.switchProject,
    activeId: project.id,
    activeXterm
  }
}

export const delProject = (id) => {

  const _projects = [ ...store.getState().project.projects ]
  const idx = _projects.findIndex(p => p.id === id)
  _projects.splice(idx, 1)

  return {
    type: types.delProject,
    projects: _projects
  }
}

export const addXterm = () => {

  const {
    projects,
    activeId
  } = store.getState().project

  const idx = projects.findIndex(p => p.id === activeId)
  // const target = projects.find(p => p.id === activeId)
  const id = generate()
  const xterm = xtermModel(id, projects[idx].cwd)

  const _projects = [ ...projects ]
  _projects[idx].xterms.push(xterm)
  _projects[idx].activeXtermId = id

  return {
    type: types.addXterm,
    projects: _projects,
    xterm
  }
}

export const switchXterm = (id) => {

  const {
    projects,
    activeId
  } = store.getState().project

  const p = projects.find(p => p.id === activeId)
  const xtermModel = p.xterms.find(x => x.id === id)
  // 记录当前project启用中的xterm，方便切换project时恢复
  p.activeXtermId = id

  return {
    type: types.switchXterm,
    xtermModel
  }
}