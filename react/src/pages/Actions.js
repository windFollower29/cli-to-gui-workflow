
import React, { Component } from 'react'

export default class Actions extends Component {


  render () {

    const {
      actions
    } = this.props

    return (

      <div className="action-list">
        {
          actions.map(action => (
            <a
              href="javascript:"
              key={action.label}
              className="action"
              script={action.script}
              onClick={this.runScript.bind(this, action)}
            >
              {action.label}
            </a>
          ))
        }
      </div>
    )
  }

  runScript (action) {
    this.props.runScript(action)
  }
}