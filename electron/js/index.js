const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItem,
  dialog
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
    this.createAppMenu()
    this.initDialog()
  }

  showFileSelector (e) {
    dialog.showOpenDialog({
      properties: ['openFile', 'openDirectory']
    }, files => {
      log.info('\nfiles: ',files)
      if (files) {
        this.win.webContents.send('selected-img', files)
        // e.sender.send('selected-directory', files)
      }
    })
  }

  initDialog () {

    ipcMain.on('open-file-dialog', this.showFileSelector.bind(this))
  }

  createAppMenu () {

    const template = [
      {
        label: 'Electron',
        role: 'electron',
        submenu: [
          {
            label: 'Quit',
            accelerator: 'CmdOrCtrl+Q',
            role: 'quit',
            click () {
              app.quit()
            }
          }
        ]
      },
      {
        label: 'View',
        role: 'view',
        submenu: [
          {
            label: 'Reload',
            accelerator: 'CmdOrCtrl+R',
            role: 'reload',
            click: (item, focusedWindow) => {
              if (focusedWindow.id === 1) {
                BrowserWindow.getAllWindows().forEach(win => {
                  if (win.id > 1) win.close()
                })
              }
              focusedWindow.reload()
            }
          },
          {
            label: 'Toggle Developer Tools',
            accelerator: 'F12',
            click: (item, focusedWindow) => {
              if (focusedWindow) {
                focusedWindow.toggleDevTools()
              }
            }
          }
        ]
      },
      {
        label: 'Tool',
        role: 'tool',
        submenu: [
          {
            label: 'Set Theme',
            click: () => {
              this.showFileSelector()
              // ipcMain.send('open-file-dialog')
            }
          }
        ]
      }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  }

  createMenu () {

    const template = [
      // {
      //   label: '刷新',
      //   // type: 'checkbox',
      //   click: this.refresh.bind(this)
      // },
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
