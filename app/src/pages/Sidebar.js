import React, { Component } from 'react'
import { connect } from 'react-redux'
import { switchProject, delProject } from '../store/actions/project'

import classNames from 'classnames'
import styles from './styles/sidebar.module.styl'
import './styles/sidebar.styl'

@connect(
  state => ({
    projects: state.project.projects,
    showId: state.project.activeId
  }),
  dispatch => ({
    switchProject: (project) => dispatch(switchProject(project)),
    delProject: id => dispatch(delProject(id))
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
        isEdit,
        name
      } = project
      // console.log('isEdit', isEdit)

      if (isEdit) {

        return (
          <input type="text"
            onClick={this.clickInput}
            onBlur={this.saveInput.bind(this, project)}
            onKeyPress={this.onKeyPress.bind(this, project)}
            // onChange
          />
        )
      }

      return (
        <span
          onDoubleClick={this.toInput.bind(this, project)}
        >
          {project.name}
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
              key={project.id}
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
        this.props.switchProject(project)
      }
    }, 300)
  }

  remove (project, e) {
    e.stopPropagation()
    // console.log('remove')
    this.props.delProject(project.id)
  }

  toInput = (project, e) => {
    // console.log(project, e)
    // e.stopPropagation()
    this.isDbc = true
    // this.props.updateProject({
    //   name: e.target.value,
    //   isEdit: true
    // })
  }

  saveInput = (project, e) => {
    e.stopPropagation()

    // this.props.updateProject({
    //   name: e.target.value,
    //   isEdit: false
    // })
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