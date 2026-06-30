const { app, BrowserWindow} = require('electron')

function createWindow () {
    const win = new BrowserWindow({
        width: 900,
        height: 700,
        frame: false,
        webPreferences:{
            nodeIntegration: true
        }
    })

    win.loadURL('http://localhost:5173')
}

app.whenReady().then(() => {
    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})