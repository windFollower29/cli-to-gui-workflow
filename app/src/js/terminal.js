

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
    this.xterm = new Terminal()

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