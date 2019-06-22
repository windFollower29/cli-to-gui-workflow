

import React, { Component } from 'react'
import classNames from 'classnames'

import { connect } from 'react-redux'
import {
  addXterm,
  switchXterm,
  delXterm
} from '../store/actions/project'

import {
  getXtermList
} from '../store/selectors/project'

@connect(
  state => ({
    xterms: getXtermList(state),
    projects: state.project.projects,
    activeXterm: state.project.activeXterm
  }),
  dispatch => ({
    addXterm: () => dispatch(addXterm()),
    switchXterm: id => dispatch(switchXterm(id)),
    delXterm: id => dispatch(delXterm(id))
  })
)
class Tabs extends Component {

  componentWillReceiveProps (props) {
    // console.log('props', props)
  }

  render () {

    const {
      projects,
      xterms,
      activeXterm,
      addXterm
    } = this.props
    // console.log('xterms', xterms)

    return (

      <div className="tabs">

        {
          projects.length &&
          <a href="javascript:"
            className="btn-add"
            onClick={addXterm.bind(this)}
          >+</a>
        }
        {
          xterms.map((term, idx) => (

            <div
              className={classNames('tab', term.id === activeXterm.id && 'active')}
              key={term.id}
              onClick={this.switch.bind(this, term.id)}
            >
              <a href="javascript:"
                onClick={this.remove.bind(this, term.id)}
              >×</a>
              # {idx}
            </div>
          ))
        }
      </div>
    )
  }

  switch (id, e) {
    // console.log('switch_tab')
    this.props.switchXterm(id)
  }

  remove (id, e) {
    e.stopPropagation()
    // console.log('remove_tab')
    this.props.delXterm(id)
  }
}

export default Tabs