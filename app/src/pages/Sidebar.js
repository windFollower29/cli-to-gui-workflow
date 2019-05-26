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
              {project.name}
            </div>
          ))
        }
      </div>
    )
  }

  switchTab = project => {
    this.props.switchTab(project)
  }
}