
// WARNNING: xterm容器里的元素不能把classname命名为"xterm",因为库已经使用该类名，因而可能会引起操作冲突

import React, { Component } from 'react'
import { connect } from 'react-redux'

import classNames from 'classnames'

require('../../../node_modules/xterm/dist/xterm.css')

// @connect(
//   state => ({
//     activeXtermId: state.project.activeXtermId,
//     xterms: state.project.projects.map
//   })
// )
export default class Terminal extends Component {

  render () {

    const {
      xterms,
      activeXtermId
    } = this.props

    return (
      <div className="xterm-list">
        {
          xterms.map(({id, cwd}, idx) => (

            <div
              key={id}
              className={classNames('xterm-' + id, 'ixterm', activeXtermId === id && 'active')}
            >

            </div>
            
          ))
        }
      </div>
    )
  }

}