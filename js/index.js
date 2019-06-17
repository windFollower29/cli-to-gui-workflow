const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItem
} = require('electron')

const log = require('electron-log')
module.exports = class Index {

  constructor (win) {

    this.win = win
    this.menu = null
    this.info = {}

    this.init()
  }

  init () {

    this.initEvent()
    this.createMenu()
  }

  createMenu () {

    const template = [
      {
        label: '刷新',
        // type: 'checkbox',
        click: this.refresh.bind(this)
      },
      {
        label: '重命名',
        // type: 'checkbox',
        click: this.rename.bind(this)
      },
      {
        label: '打开文件目录',
        // type: 'checkbox',
        click: this.openFileManager.bind(this)
      }
    ]
    this.menu = Menu.buildFromTemplate(template)
    // this.menu.append(new MenuItem({ label: '刷新', type: 'checkbox' }))
    // this.menu.append(new MenuItem({ label: '重命名', type: 'checkbox' }))
  }

  refresh () {
    console.log('refresh', this)
    this.win.webContents.send('refresh', this.info.id)
  }

  rename () {
    // console.log('rename', this)
    this.win.webContents.send('rename', this.info.id)
  }

  openFileManager () {
    this.win.webContents.send('open-file-manager', this.info.cwd)
  }

  initEvent () {

    // app.on('browser-window-created', (e, win) => {
    //   win.webContents.on('context-menu', (e, params) => {
    //     log.info('---')
    //     this.menu.popup(win, params.x, params.y)
    //   })
    // })

    ipcMain.on('show-context-menu', (e, data) => {
      // log.info(data, a, b)
      this.info = data
      const win = BrowserWindow.fromWebContents(e.sender)
      // log.info(win, this.menu)
      this.menu.popup(win)
    })
  }
}
