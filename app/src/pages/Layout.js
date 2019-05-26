

import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import { generate } from 'shortid'

import Sidebar from './Sidebar'
import Main from './Main'

const path = window.require('path')
const fs = window.require('fs')
const os = window.require('os')

const projectModel = (id, name) => ({
  id,
  name
})

export default class Layout extends Component {

  state = {

    isFileOver: false,
    showId: undefined,
    projects: [],
  }

  constructor (props) {

    super(props)

    this.mainRef = null
  }

  render () {

    const {
      projects,
      isFileOver,
      showId
    } = this.state

    return (

      <div>

        <Sidebar
          showId={showId}
          projects={projects}
          switchTab={this.switchTab.bind(this)}
        />

        <Main
          showId={showId}
          ref={el => this.mainRef = el}
          showUploadMask={isFileOver}
        />
      </div>
    )
  }

  componentDidMount () {

    console.log(process, os, os.platform())

    this.initEvent()
  }

  initEvent () {

    let counter = 0

    const mainDom = ReactDOM.findDOMNode(this.mainRef)
    
    mainDom.addEventListener('dragenter', e => {
      e.preventDefault()
      counter++
      this.setState({ isFileOver: true })

    }, false)

    mainDom.addEventListener('dragover', e => {
      e.preventDefault()
    }, false)

    mainDom.addEventListener('dragleave', e => {
      e.preventDefault()

      --counter === 0 && this.setState({ isFileOver: false })

    }, false)

    mainDom.addEventListener('drop', this.parseJsonFile, false)
  }

  parseJsonFile = (e) => {
    e.preventDefault()
    this.setState({ isFileOver: false })

    const file = e.dataTransfer.files[0].path

    const { dir, ext } = path.parse(file)
    
    if (ext !== '.json') {
      return alert('请选择.json文件')
    }

    const uuid = generate()
    
    this.setState({ showId: uuid }, () => {
      
      this.updateSidebar(uuid)
  
      this.mainRef.addProject(file, uuid)
    })

  }

  updateSidebar (uuid) {
    const arr  = [
      ...this.state.projects,
      projectModel(uuid, `项目${this.state.projects.length + 1}`)
    ]

    this.setState({ projects: arr })
  }

  switchTab (tab) {
    console.log(tab)
    this.setState({ showId: tab.id })
  }
}