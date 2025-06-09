const { app, BrowserWindow } = require('electron');
const path = require('path');

let splash;
let mainWindow;

function createWindow() {
    splash = new BrowserWindow({
        width: 400,
        height: 300,
        transparent: true,
        frame: false,
        alwaysOnTop: true,
    });

    splash.loadFile(path.join(__dirname, 'public', 'splash.html'));

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: path.join(__dirname, 'public', 'vite.ico'),
        show: false,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false
        }
    });
    mainWindow.removeMenu();

    mainWindow.loadURL('https://dev-gsm.lucidtest.in');

    mainWindow.webContents.on('did-finish-load', () => {
        setTimeout(() => {
            splash.close();
            mainWindow.show();
        }, 1000); // Optional delay
    });
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})