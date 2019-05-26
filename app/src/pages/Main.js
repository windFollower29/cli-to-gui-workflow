

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import { generate } from 'shortid'

import Xterm from '../js/terminal'

import FileUpload from '../components/FileUpload'
import Terminal from './Terminal'
import Action from './Actions'

const fs = window.require('fs')
const path = window.require('path')

const projectModel = (id, actions, xterms, cwd, showTaskId) => ({
  id,
  actions,
  xterms,
  cwd,
  showTaskId
})

export default class Main extends Component {

  state = {
    projects: [],
    // showTaskId: ''
  }

  constructor (props) {
    super(props)

    this.topRef = null
    this.xtermRef = null
    this.uploadRef = null
  }

  render () {

    const {
      projects,
      // showTaskId
    } = this.state

    const {
      showUploadMask,
      showId
    } = this.props

    return (

      <div
        id="drop-zone"
        className={classNames('drop-zone', { active: showUploadMask })}
      >
        {
          projects.map(({id, actions, xterms, showTaskId}) => (
            <div key={id} style={{height: '100%'}}
              className={classNames(id === showId && 'active', 'work-space')}
            >
              <div
                ref={el => this.topRef = el}
              >
                <Action
                  actions={actions}
                  runScript={this.runScript.bind(this)}
                />

                <select id=""
                  value={showTaskId}
                  onChange={this.switchXterm.bind(this)}
                >
                  {
                    xterms.map((x, idx) => (
                      <option
                        key={x.id}
                        value={x.id}
                      >
                        {x.id}----{idx}
                      </option>
                    ))
                  }
                </select>
              </div>

              <Terminal
                showTaskId={showTaskId}
                ref={el => this.xtermRef = el}
                xterms={xterms}
              />
            </div>
          ))
        }

        {
          showUploadMask &&
          <FileUpload
            ref={el => this.uploadRef = el}
          />
        }

        <a href="javascript:" className="add-xterm"
          onClick={this.addXterm.bind(this)}
        >+</a>

      </div>

    )

  }


  componentDidMount () {
    
    this.initEvent()

  }

  componentDidUpdate () {
    // 更新xterm的fit
    // this.handleResize()
  }

  initEvent () {

    window.addEventListener('resize', this.handleResize, false)
  }

  handleResize = () => {

    const _project = this.getCurrentProject()

    if (!_project) {
      return
    }

    this.adjustLayout()

    const xterm = _project.xterms.find(item => item.id === _project.showTaskId).xterm

    xterm.fit()
  }

  runScript (action) {
    // console.log(action, action.xterm)
    action.xterm.emit('data', `npm run ${action.label}\n`)
  }

  getCurrentProject () {
    return this.state.projects.find(p => p.id === this.props.showId)
  }

  switchXterm (e) {

    const idx = this.state.projects.findIndex(p => p.id === this.props.showId)

    const _projects = [ ...this.state.projects ]

    _projects[idx].showTaskId = e.currentTarget.value

    this.setState({ projects: _projects }, this.handleResize)
  }

  addXterm () {
    const _project = this.getCurrentProject()

    const cwd = _project.cwd
    const id = generate()
    
    _project.showTaskId = id

    const xterm = new Xterm({ cwd })

    _project.xterms.push({
      id,
      cwd,
      xterm: xterm.xterm,
      // showTaskId: id
    })

    this.setState({}, () => {

      this.adjustLayout()

      xterm.open(`xterm-${id}`)
      xterm.xterm.fit()
      xterm.initEvent()

    })
  }

  addProject (file, uuid) {

    const { dir } = path.parse(file)

    fs.readFile(file, 'utf8', (err, data) => {

      if (err) return err

      const taskId = generate()

      const xterm = new Xterm({
        cwd: dir
      })
  
      const xterms = [
        {
          id: taskId,
          cwd: dir,
          xterm: xterm.xterm
        }
      ]

      const scripts = JSON.parse(data).scripts
  
      const actions = Object.keys(scripts).map(key => ({
        id: generate(),
        label: key,
        script: scripts[key],
        xterm: xterm.xterm
      }))
  
      const _project = projectModel(uuid, actions, xterms, dir, taskId)
  
      const arr = [
        ...this.state.projects,
        _project
      ]

      this.setState({
        projects: arr,
      }, () => {

        this.adjustLayout()

        xterm.open(`xterm-${taskId}`)
        xterm.xterm.fit()
        xterm.initEvent()

      })

    })

  }

  adjustLayout () {

    const dropZoneHeight = document.getElementById('drop-zone').getClientRects()[0].height

    const activeWorkSpaceDom = Array.prototype.filter.call(document.querySelectorAll('.work-space'), node => node.className.includes('active'))

    const xtermListDom = activeWorkSpaceDom[0].querySelector('.xterm-list')
    
    const topHeight = activeWorkSpaceDom[0].querySelector('.action-list').getClientRects()[0].height
    
    xtermListDom.style.height = dropZoneHeight - topHeight + 'px'
  }
}