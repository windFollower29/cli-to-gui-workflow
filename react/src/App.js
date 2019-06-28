
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setTheme } from './store/actions/theme'

import Layout from './pages/Layout'

const { ipcRenderer } = window.require('electron')

@connect(
  state => ({
    theme: state.theme
  }),
  dispatch => ({
    setTheme: (path) => dispatch(setTheme(path))
  })
)
class App extends Component {

  componentDidMount () {
    ipcRenderer.on('selected-img', (e, files) => {
      const imgPath = files[0]
      this.props.setTheme(imgPath)
    })
  }

  render () {

    const bgi = this.props.theme
      ? "url('file://" + this.props.theme + "')"
      : null

    return (

      <div className="App"
        style={{ backgroundImage: bgi }}
      >
        <Layout />
      </div>
    )
  }
}

export default App