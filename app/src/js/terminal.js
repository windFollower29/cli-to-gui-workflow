

const os = window.require('os')
const pty = window.require('node-pty')
const Terminal = window.require('xterm').Terminal
const fit = window.require('xterm/lib/addons/fit/fit')

Terminal.applyAddon(fit)

export default class Xterm {

  constructor (opts = {}) {

    this.opts = {
      name: 'xterm-color',
      // cols: 80,
      // rows: 30,
      // cwd: dir,
      env: process.env,
      ...opts
    }

    this.xterm = null
    this.ptyProcess = null

    this.createTerminal()

  }

  createTerminal () {

    const shell = Xterm.shell
    console.log(shell)

    this.ptyProcess = pty.spawn(shell, [], this.opts)
    this.xterm = new Terminal({
      allowTransparency: true,
      theme: {
        // background: 'hsla(0,0%,100%,.8)',
        // foreground: '#000'
        background: 'rgba(59,59,59,.3)'
        // background: '#3b3b3b'
        // foreground: '#ffffff',
        // background: '#000',
        // cursor: '#ffffff',
        // selection: 'rgba(255, 255, 255, 0.3)',
        // black: '#000000',
        // red: '#e06c75',
        // brightRed: '#e06c75',
        // green: '#A4EFA1',
        // brightGreen: '#A4EFA1',
        // brightYellow: '#EDDC96',
        // yellow: '#EDDC96',
        // magenta: '#e39ef7',
        // brightMagenta: '#e39ef7',
        // cyan: '#5fcbd8',
        // brightBlue: '#5fcbd8',
        // brightCyan: '#5fcbd8',
        // blue: '#5fcbd8',
        // white: '#d0d0d0',
        // brightBlack: '#808080',
        // brightWhite: '#ffffff'
      }
    })

    // this.initEvent()
  }

  initEvent () {

    this.xterm.on('data', data => {
      this.ptyProcess.write(data)
    })

    this.ptyProcess.on('data', data => {
      this.xterm.write(data)
    })


    this.xterm.on('focus', () => {
      console.log('focus')
    })

    this.xterm.textarea.onkeypress = function (e) {
      console.log('press', String.fromCharCode(e.keyCode))
      // term.write(String.fromCharCode(e.keyCode))
    }

    this.xterm.on('key', (key, e) => {

      console.log('key', key, e)

      if (key.charCode == 13) {

        this.xterm.write('\n');

      } 
      // else {

      //   this.xterm.write(key);
      // }
    })
  }

  open (className) {

    const dom = document.querySelector(`.${className}`)

    this.xterm.open(dom)
  }

  static get shell () {
    return window.process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL']
  }
}