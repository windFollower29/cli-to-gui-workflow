

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
  switchXterm,
} from '../store/actions/project'

@connect(
  state => ({
    projects: state.project.projects,
    showId: state.project.activeId,
    activeXterm: state.project.activeXterm,
    isNew: state.project.isNew
  }),
  dispatch => ({
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
          projects.map(({id, actions, xterms}) => {
            return !actions ? null : (

              <div key={id} style={{height: '100%'}}
                test={showId}
                className={classNames(id === showId && 'active', 'work-space')}
              >
                <div
                  ref={el => this.topRef = el}
                >
                  <Action
                    actions={actions}
                    runScript={this.runScript.bind(this)}
                  />

                </div>

                <Terminal
                  ref={el => this.xtermRef = el}
                  xterms={xterms}
                  activeXtermId={activeXterm.id}
                />
              </div>
            )
          })
        }

        {
          showUploadMask &&
          <FileUpload
            ref={el => this.uploadRef = el}
          />
        }

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

    // console.log('----', prevActiveXterm, activeXterm, isNew)
    // console.log('update', activeXterm)

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

    // this.adjustLayout()
    // this.props.activeXterm &&
    // this.props.activeXterm.xterm.xterm.fit()

    if (this.props.activeXterm) {

      this.adjustLayout()
      this.props.activeXterm.xterm.xterm.fit()
    }

  }

  runScript (action) {

    this.props.activeXterm.xterm.xterm.emit('data', `npm run ${action.label}\n`)
  }

  getCurrentProject () {
    return this.props.projects.find(p => p.id === this.props.showId)
  }

  switchXterm (e) {
    // console.log('switch', e, e.currentTarget.value)
    this.props.switchXterm(e.currentTarget.value)

  }

  addXterm () {

    this.props.addXterm()

  }

  initWorkspace (model, isNew) {
    this.adjustLayout()
    // console.log('----', model, isNew)

    if (isNew) {
      model.xterm.open(`xterm-${model.id}`)
      model.xterm.initEvent()
    }
    model.xterm.xterm.fit()
  }

  adjustLayout () {

    // console.log(document.getElementById('drop-zone').getBoundingClientRect().width)
    // return

    const dropZoneHeight = document.getElementById('drop-zone').getBoundingClientRect().height

    const activeWorkSpaceDom = Array.prototype.filter.call(document.querySelectorAll('.work-space'), node => node.className.includes('active'))

    const xtermListDom = activeWorkSpaceDom[0].querySelector('.xterm-list')
    
    const topHeight = activeWorkSpaceDom[0].querySelector('.action-list').getBoundingClientRect().height
    
    xtermListDom.style.height = dropZoneHeight - topHeight + 'px'
  }

  saveStorage (arr) {
    window.localStorage.setItem('projects', JSON.stringify(arr))
  }
}

export default React.forwardRef((props, ref) => {
  // console.log('---', props)
  // if (!props.showId) return null

  return (

    <Main
      myRef={ref}
      {...props}
    />
  )
})