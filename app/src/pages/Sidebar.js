import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  asyncLoad,
  initProject,
  switchProject,
  delProject,
  rename,
  enableEdit
} from '../store/actions/project'

import classNames from 'classnames'
import styles from './styles/sidebar.module.styl'
import './styles/sidebar.styl'

@connect(
  state => ({
    projects: state.project.projects,
    showId: state.project.activeId
  }),
  dispatch => ({
    asyncLoad: project => dispatch(asyncLoad(project)),
    initProject: project => dispatch(initProject(project)),
    switchProject: (project) => dispatch(switchProject(project)),
    delProject: id => dispatch(delProject(id)),
    rename: (pid, name) => dispatch(rename(pid, name)),
    enableEdit: (pid) => dispatch(enableEdit(pid))
  })
)
class Sidebar extends Component {

  constructor (props) {
    super(props)

    this.timer = null
    this.isDbc = false
  }

  render () {

    const {
      projects,
      showId
    } = this.props

    const ProjectItem = ({project}) => {
      const {
        isNameEdit,
        name
      } = project
      // console.log('isNameEdit', isNameEdit)

      if (isNameEdit) {

        return (
          <input type="text"
            autoFocus
            onClick={this.clickInput}
            onBlur={this.saveInput.bind(this, project)}
            onKeyPress={this.onKeyPress.bind(this, project)}
            placeholder={name}
          />
        )
      }

      return (
        <span
          test={project.id}
          onDoubleClick={this.toInput.bind(this, project)}
        >
          {name}
        </span>
      )
    }

    return (

      <div
        className={classNames(styles.sidebar, 'sidebar')}
      >

        {
          projects.map(project => (
            <div
              className={
                classNames('project', showId === project.id && 'active')
              }
              key={project.id || project.cwd}
              onClick={this.switchTab.bind(this, project)}
            >
              <ProjectItem project={project} />

              <a href="javascript:"
                className="remove"
                onClick={this.remove.bind(this, project)}
              >x</a>
            </div>
          ))
        }
      </div>
    )
  }

  getSnapshotBeforeUpdate (prevProps, prevState) {
    // console.log('componentWillUpdate', prevProps, prevState)
    return 'test'
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    // console.log('componentDidUpdate', prevProps, prevState, snapshot)
  }

  switchTab = project => {
    // this.props.switchTab(project)

    this.timer && clearTimeout(this.timer)

    this.timer = setTimeout(() => {
      if (this.isDbc) {
        this.isDbc = false
      } else {
        // console.log('click')
        // console.log('switchTab')
        project.xterms
          ? this.props.switchProject(project)
          // : this.props.asyncLoad(project)
          : this.props.initProject(project)
      }
    }, 300)
  }

  remove (project, e) {
    e.stopPropagation()
    // console.log('remove')
    this.props.delProject(project.id)
  }

  toInput = (project, e) => {
    e.stopPropagation()

    this.isDbc = true
    this.props.enableEdit(project.id)
  }

  saveInput = (project, e) => {
    e.stopPropagation()

    this.props.rename(project.id, e.target.value)
  }

  onKeyPress (project, e) {
    // e.stopPropagation()

    if (e.which === 13) {
      this.saveInput(project, e)
    }
  }

  clickInput = e => {
    e.stopPropagation()

    
  }
}

export default Sidebar