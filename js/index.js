
const fs = require('fs')
const path = require('path')
console.log(path)

const spwan = require('child_process').spawn
const exec = require('child_process').exec

const os = require('os')

const Terminal = require('xterm').Terminal
// const attach = require('../node_modules/xterm/lib/addons/attach/attach').attach
// import * as attach from 'xterm/lib/addons/attach/attach'
const pty = require('node-pty')

const { ipcRenderer } = require('electron')

const osascript = require('node-osascript')


// const Xterm = require('electron').remote.require('./../js/terminal.js')
const Xterm = require(path.resolve(__dirname, 'js/terminal.js'))


class Index {

  constructor () {

    this.files = []

    this.xterm = null

    this.elDropZone = null
    this.elCmdList = null

    this.init()
  }

  init () {

    // this.logOnPage()

    this.initEvent()

    this.initCommunicate()
  }

  initCommunicate () {

    const val = ipcRenderer.sendSync('test', 'hello')
    // console.log(val)
  }

  initEvent () {

    window.addEventListener('load', () => {

      this.elDropZone = document.getElementById('drop-zone')
      this.elCmdList = document.getElementById('cmd-list')

      this.elDropZone.addEventListener('dragover', e => {
        e.preventDefault()

      }, false)

      this.elDropZone.addEventListener('drop', e => {
        e.preventDefault()

        console.log(e.dataTransfer.files)
        const { dir } = path.parse(e.dataTransfer.files[0].path)

        this.xterm = this.createTerminal(dir)
        // this.xterm.element.focus()
        // this.emitKeyEvent('Enter', 13)
        // this.xterm = new Xterm(dir)
        // console.log(this.xterm)

        for (let file of e.dataTransfer.files) {
          // console.log(file)
          this.parseFile(file.path)
        }

      }, false)

      this.elCmdList.addEventListener('click', e => {
        e.stopPropagation()
        const el = e.target
        // console.log(el)
        // console.log(el.getAttribute('cmd'))
        this.exec(el)
      }, false)

    })
  }

  createSpawn () {
    let p = null

    return () => {

    }
  }

  exec (el) {
    const dir = el.getAttribute('dir')
    const cmd = el.getAttribute('cmd')

    // this.xterm.write(`npm run ${cmd}`)
    // this.xterm.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
    // this.xterm.textarea.value = `hello world !`
    // this.xterm.writeln('Hello World!')
    // this.xterm.emit('data')

    // this.xterm.element.focus()
    this.xterm.emit('data', `npm run ${cmd}\n`)
    // const e = new KeyboardEvent('keyup', {
    //   key: 'Enter',
    //   code: 'Enter',
    //   charCode: 13
    // })
    // console.log('e', e)
    // this.xterm.emit('key', e)

  }

  emitKeyEvent (key, charCode) {
    const e = new KeyboardEvent('keyup', {
      key,
      charCode
    })

    console.log('e', e)

    this.xterm.emit('key', e)
  }

  createTerminal (dir) {
    const shell = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL']
 
    const ptyProcess = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: dir,
      env: process.env
    })

    // ptyProcess._defer((f) => {
    //   console.log('_defer', f)
    // })

    const xterm = new Terminal();
    xterm.open(document.getElementById('terminal'));
    xterm.emit('focus')
        
    xterm.on('data', function(data) {
      console.log(data)
      ptyProcess.write(data);
    })
    console.log(xterm.textarea)


    
    ptyProcess.on('data', data => {
      xterm.write(data)
    })

    console.log(xterm)
    return xterm

  }

  createPty (xterm) {

  }

  logOnPage () {
    const old = console.log

    const logger = document.getElementById('log')

    console.log = (message) => {
      if (typeof message == 'object') {
        logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
      } else {
        logger.innerHTML += message + '<br />';
      }
    }
  }

  parseFile (file) {

    fs.readFile(file, 'utf8', (err, data) => {
      if (err) return err

      const { ext } = path.parse(file)
      if (ext !== '.json') {

        return
      }

      this.files.push({
        scripts: JSON.parse(data).scripts,
        path: file
      })
      // console.log(this.files)
      this.generateTask()
    })
  }

  generateTask () {
    this.files.forEach(file => {
      this.generateList(file)
    })
  }

  generateList (file) {
    const btns = this.createHTML(file)

    const div = document.createElement('div')
    btns.forEach(btn => {
      div.appendChild(btn)
    })

    this.elCmdList.appendChild(div)
  }

  createHTML (info) {
    let arr = []

    arr = Object.keys(info.scripts).map((key, idx) => {

      // const key = item[idx]
      const val = info.scripts[key]

      const btn = document.createElement('button')
      btn.textContent = key
      btn.setAttribute('cmd', key)
      btn.setAttribute('dir', path.parse(info.path).dir)

      return btn

    })

    return arr
    
  }
}

module.exports = new Index()