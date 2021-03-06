'use strict'

const isDev = require('electron-is-dev')

// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')

const { ipcMain } = require('electron')
const log = require('electron-log')
// require('electron-reload')('{./*.js,./js/*.js}')
// require('electron-reload')(path.join(__dirname, 'main.js'), {
//   electron: path.resolve(__dirname, 'node_modules', '.bin', 'electron')
// })

const Index = require('./js/index')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  const { screen } = require('electron')
  const size = screen.getPrimaryDisplay().size
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: size.height,
    webPreferences: {
      nodeIntegration: true
    },
    webPreferences: {
      webSecurity: false
    }
  })

  new Index(mainWindow)

  // load the index.html of the app.
  isDev 
    ? mainWindow.loadURL('http://localhost:3000/index.html')
    : mainWindow.loadFile(path.join(__dirname, '../react/build/index.html'))

  // Open the DevTools.
  isDev && 
  mainWindow.webContents.openDevTools()
  // log.info(mainWindow.webContents)

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
