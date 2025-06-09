const { app, BrowserWindow, dialog } = require('electron');
const { autoUpdater } = require('electron-updater'); // ✅ Correct import
const path = require('path');
const log = require('electron-log');

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
            nodeIntegration: false,
        }
    });

    mainWindow.removeMenu();
    mainWindow.loadURL('https://dev-gsm.lucidtest.in');

    mainWindow.webContents.on('did-finish-load', () => {
        setTimeout(() => {
            splash.close();
            mainWindow.show();
        }, 1000);
    });
}

// === Auto-updater Setup ===
function setupAutoUpdater() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;

    // ✅ Automatically checks for update and downloads
    autoUpdater.checkForUpdatesAndNotify();

    // 🔔 Optional: show logs in terminal
    autoUpdater.on('checking-for-update', () => {
        log.info('🔍 Checking for update...');
    });

    autoUpdater.on('update-available', (info) => {
        log.info('✅ Update available:', info);
        dialog.showMessageBox({
            type: 'info',
            title: 'Update Available',
            message: 'A new version is available and downloading...',
        });
    });

    autoUpdater.on('update-not-available', () => {
        log.info('🚫 No update available.');
    });

    autoUpdater.on('error', (err) => {
        log.error('❌ Update error:', err);
        dialog.showErrorBox('Update Error', err == null ? 'unknown' : (err.stack || err).toString());
    });

    autoUpdater.on('download-progress', (progressObj) => {
        // log.info(`📥 Download speed: ${progressObj.bytesPerSecond}`);
        // log.info(`Downloaded ${progressObj.percent.toFixed(2)}%`);
        let log_message = `Download speed: ${progressObj.bytesPerSecond}`;
        log_message += ` - Downloaded ${progressObj.percent.toFixed(1)}%`;
        log_message += ` (${(progressObj.transferred / 1024 / 1024).toFixed(2)} MB of ${(progressObj.total / 1024 / 1024).toFixed(2)} MB)`;
        log.info(log_message);
    });

    autoUpdater.on('update-downloaded', () => {
        log.info('✅ Update downloaded. Will install on quit.');
        dialog.showMessageBox({
            type: 'info',
            title: 'Update Ready',
            message: 'Update downloaded. The application will now restart to apply the update.',
        }).then(() => {
            autoUpdater.quitAndInstall();
        });
    });
}

app.whenReady().then(() => {
    createWindow();
    setupAutoUpdater();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
