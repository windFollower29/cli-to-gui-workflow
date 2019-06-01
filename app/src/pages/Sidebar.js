import React, { Component } from 'react'

import classNames from 'classnames'
import styles from './styles/sidebar.module.styl'
import './styles/sidebar.styl'

export default class Sidebar extends Component {

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

      if (isEdit) {

        return (
          <input type="text"
            // onBlur={this.saveInput.bind(project)}
            onKeyPress={this.saveInput.bind(project)}
          />
        )
      }

      return (
        <span
          onDoubleClick={this.toInput}
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
              key={project.name}
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

  switchTab = project => {
    this.props.switchTab(project)
  }

  remove (project, e) {
    e.stopPropagation()
    console.log('remove')
  }

  toInput = e => {
    e.stopPropagation()


  }

  saveInput = (project, e) => {
    e.stopPropagation()

    // project.isEdit = false
  }
}