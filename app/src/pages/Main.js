

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { generate } from 'shortid'

import Xterm from '../js/terminal'

import FileUpload from '../components/FileUpload'
import Terminal from './Terminal'
import Action from './Actions'

import {
  addXterm,
  switchXterm,
} from '../store/actions/project'

const fs = window.require('fs')
const path = window.require('path')


/**
 * 
 * @param {String} id identification of project
 * @param {Array} actions scripts in package.json
 * @param {Array} xterms Array of instances of xterm
 * @param {String} cwd root path of the project, as well as, default path of teminal
 * @param {String} showTaskId id of the active terminal
 */
const projectModel = (id, actions, xterms, cwd, showTaskId) => ({
  id,
  actions,
  xterms,
  cwd,
  showTaskId
})

@connect(
  state => ({
    projects: state.project.projects,
    showId: state.project.activeId,
    activeXterm: state.project.activeXterm,
    isNew: state.project.isNew
  }),
  dispatch => ({
    addXterm: () => dispatch(addXterm()),
    switchXterm: (id) => dispatch(switchXterm(id))
  })
)
class Main extends Component {

  constructor (props, ref) {
    super(props)

    this.topRef = null
    this.xtermRef = null
    this.uploadRef = null
  }

  render () {

    // const {
    //   projects,
    // } = this.state

    const {
      myRef,
      projects,
      showId,
      activeXterm,
      showUploadMask,
    } = this.props

    return (

      <div
        id="drop-zone"
        ref={myRef}
        className={classNames('drop-zone', { active: showUploadMask })}
      >
        {
          projects.map(({id, actions, xterms}) => (
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
                  value={activeXterm.id}
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
                ref={el => this.xtermRef = el}
                xterms={xterms}
                activeXtermId={activeXterm.id}
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
    
    // this.adjustLayout()
    this.initEvent()

  }

  getSnapshotBeforeUpdate (prevProps, prevState) {

    return null
  }

  componentDidUpdate (prevProps, prevState, snapshot) {

    const {
      activeXterm,
      isNew
    } = this.props

    const {
      activeXterm: prevActiveXterm
    } = prevProps

    console.log('----', prevActiveXterm, activeXterm, isNew)

    if (!activeXterm) return

    if (
      (!prevActiveXterm && activeXterm) ||
      activeXterm.id != prevActiveXterm.id
    ) {
      this.initWorkspace(activeXterm, isNew)
    }
  }

  initEvent () {

    window.addEventListener('resize', this.handleResize, false)
  }

  handleResize = () => {

    if (this.props.activeXterm) {

      this.adjustLayout()
      this.props.activeXterm.xterm.xterm.fit()
    }

  }

  runScript (action) {
    // action.xterm.emit('data', `npm run ${action.label}\n`)
    const _project = this.getCurrentProject()

    const xterm = _project.xterms.find(x => x.id === _project.activeXtermId)

    xterm.xterm.emit('data', `npm run ${action.label}\n`)
  }

  getCurrentProject () {
    return this.props.projects.find(p => p.id === this.props.showId)
  }

  switchXterm (e) {
    console.log('switch', e, e.currentTarget.value)
    this.props.switchXterm(e.currentTarget.value)

    // const idx = this.state.projects.findIndex(p => p.id === this.props.showId)

    // const _projects = [ ...this.state.projects ]

    // _projects[idx].activeXtermId = e.currentTarget.value

    // this.setState({ projects: _projects }, this.handleResize)
  }

  addXterm () {

    this.props.addXterm()

    // const _project = this.getCurrentProject()

    // const cwd = _project.cwd
    // const id = generate()
    
    // _project.showTaskId = id

    // const xterm = new Xterm({ cwd })

    // _project.xterms.push({
    //   id,
    //   cwd,
    //   xterm: xterm.xterm,
    // })

    // this.setState({}, () => {

    //   this.initWorkspace(xterm, id)

    // })
  }

  // addProject (file, uuid) {

  //   const { dir } = path.parse(file)

  //   fs.readFile(file, 'utf8', (err, data) => {

  //     if (err) return err

  //     const id = generate()

  //     const xterm = new Xterm({
  //       cwd: dir
  //     })
  
  //     const xterms = [
  //       {
  //         id,
  //         cwd: dir,
  //         xterm: xterm.xterm
  //       }
  //     ]

  //     const scripts = JSON.parse(data).scripts
  
  //     const actions = Object.keys(scripts).map(key => ({
  //       id: generate(),
  //       label: key,
  //       script: scripts[key],
  //     }))
  
  //     const _project = projectModel(uuid, actions, xterms, dir, id)
  
  //     const arr = [
  //       ...this.state.projects,
  //       _project
  //     ]

  //     this.setState({
  //       projects: arr,
  //     }, () => {

  //       this.initWorkspace(xterm, id)

  //     })

  //   })

  // }

  initWorkspace (model, isNew) {
    this.adjustLayout()
    console.log('----', model, isNew)

    if (isNew) {
      model.xterm.open(`xterm-${model.id}`)
      model.xterm.initEvent()
    }
    model.xterm.xterm.fit()
  }

  adjustLayout () {

    const dropZoneHeight = document.getElementById('drop-zone').getClientRects()[0].height

    const activeWorkSpaceDom = Array.prototype.filter.call(document.querySelectorAll('.work-space'), node => node.className.includes('active'))

    const xtermListDom = activeWorkSpaceDom[0].querySelector('.xterm-list')
    
    const topHeight = activeWorkSpaceDom[0].querySelector('.action-list').getClientRects()[0].height
    
    xtermListDom.style.height = dropZoneHeight - topHeight + 'px'
  }

  saveStorage (arr) {
    window.localStorage.setItem('projects', JSON.stringify(arr))
  }
}

// const ConnectMain = connect(
//   state => ({
//     projects: state.project.projects
//   })
// )(Main)

export default React.forwardRef((props, ref) => {

  return (

    <Main
      myRef={ref}
      {...props}
    />
  )
})