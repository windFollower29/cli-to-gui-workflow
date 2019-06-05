

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { addProject } from '../store/actions/project'

import { generate } from 'shortid'

import Sidebar from './Sidebar'
import Main from './Main'

const path = window.require('path')
const fs = window.require('fs')
const os = window.require('os')

const projectModel = (id, name) => ({
  id,
  name,
  isEdit: true
})

@connect(
  state => ({
    projects: state.project.projects
  }),
  dispatch => ({
    addProject: (jsonFile) => dispatch(addProject(jsonFile))
  })
)
class Layout extends Component {

  state = {

    isFileOver: false,
    showId: undefined,
    // projects: [
    //   // {
    //   //   id: 2,
    //   //   name: '吸猫1',
    //   //   isEdit: false
    //   // }
    // ],
  }

  constructor (props) {

    super(props)
    console.log(props)

    // this.mainRef = null
    this.mainRef = React.createRef()
  }

  // updateProject (obj) {
  //   this.setState({
  //     projects: [
  //       {
  //         id: 2,
  //         name: obj.name,
  //         isEdit: obj.isEdit
  //       }
  //     ]
  //   })
  // }

  render () {

    const {
      // projects,
      isFileOver,
      showId
    } = this.state

    const {
      projects
    } = this.props

    return (

      <div>

        <Sidebar
          showId={showId}
          // projects={projects}
          switchTab={this.switchTab.bind(this)}
          // updateProject={this.updateProject.bind(this)}
        />

        <Main
          showId={showId}
          ref={this.mainRef}
          showUploadMask={isFileOver}
        />
      </div>
    )
  }

  componentDidMount () {

    this.initEvent()
  }

  initEvent () {

    let counter = 0

    const mainDom = ReactDOM.findDOMNode(this.mainRef.current)
    
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

    this.props.addProject(file)

    // const uuid = generate()
    
    // this.setState({ showId: uuid }, () => {
      
    //   this.updateSidebar(uuid)
  
    //   this.mainRef.addProject(file, uuid)

    // })

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

export default Layout