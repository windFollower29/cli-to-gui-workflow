
const fs = require('fs')
const path = require('path')

const spwan = require('child_process').spawn
const exec = require('child_process').exec

const { ipcRenderer } = require('electron')

const osascript = require('node-osascript')

class Index {

  constructor () {

    this.files = []

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

    // const p = spwan('npm', ['run', cmd], {
    //   cwd: dir
    // })
    // const c = `osascript -e 'tell application "iTerm" to do script "cd ${dir} && npm run ${cmd}"'
    // `

    // const c = `osascript -e 'tell application "iTerm" to activate' -e 'tell application "iTerm" to do script "npm run ${cmd}"'`
    // const c = `osascript -e 'tell application "iTerm" to activate' -e 'delay 5' -e 'tell application "iTerm" to do script "ls"'`

    
    // const p = spwan('open', [ '-a', 'iTerm', dir ])
    
    const c = `ttab -a iTerm2 'cd ${dir}; npm run ${cmd}'`
    
    const p = exec(c)

    window.localStorage.setItem('test', c)
    

    // osascript.execute(c, function(err, result, raw){
    //   if (err) return console.error(err)
    //   console.log('1', result, raw)

    // })

    // p.stdout.on('data', (data) => {
    //   console.log(`stdout: ${data}`);
    // });
    
    // p.stderr.on('data', (data) => {
    //   console.log(`stderr: ${data}`);
    // });
    
    // p.on('close', (code) => {
    //   console.log(`子进程退出码：${code}`);
    //   console.log('p', p)
    // });
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