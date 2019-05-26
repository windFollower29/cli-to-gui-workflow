import React, { Component } from 'react'

export default class FileUpload extends Component {

  render () {

    return (
      <div id="file-upload">
        <input id="input-upload" type="file"/>
        <label htmlFor="input-upload" className="icon-plus">+</label>
      </div>
    )
  }
}