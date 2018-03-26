const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const Instagram = require('instagram-web-api')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

async function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({ width: 400, height: 400 })

    // and load the index.html of the app.
    // win.loadURL(url.format({
    //     pathname: path.join(__dirname, 'index.html'),
    //     protocol: 'file:',
    //     slashes: true
    // }))
    win.loadURL('http://localhost:3000');

    const interval = setInterval(run, 1500)

    // const res = await createClientAndLogin('awesome.amazon','sebastian')

    // console.log(res)

    // Open the DevTools.
    win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
        clearInterval(interval)
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.

  ipcMain.on('login-message', (event, arg) => {
    console.log(arg)  
    win.send('login-reply', 'kek')
  })



let client
let running = false

const createClientAndLogin = async (username, password) => {
    client = new Instagram({ username, password })

    //cookies array length = 2 if unsucefful, else 5
    let loginObj = await client.login()

    if (loginObj.cookies.length === 2)
        return false

    running = true
    return true
}


const run = async () => {
    if (!running) return
    
    console.log('running')
}

const logout = async () => {
    running = false
    await client.logout()
}

