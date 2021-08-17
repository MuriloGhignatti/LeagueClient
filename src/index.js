const { app, BrowserWindow,ipcMain } = require('electron');
const {request, authenticate} = require('league-connect')
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let connection;
let mainWindow;

const createWindow = () => {
  // Create the browser window.
    mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  //onStartApplication()

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.webContents.send('applicationStart', null)

  onStartApplication();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on('switchButtonClicked', (event, activateChat) => {
  console.log('Received switchButtonClicked message')
  if(activateChat){
    const response = request({
      method: 'PUT',
      url: '/lol-chat/v1/me',
      body: '{"availability": "chat"}'
    }, connection)
  } else {
    const response = request({
      method: 'PUT',
      url: '/lol-chat/v1/me',
      body: '{"availability": "offline"}'
    }, connection)
  }
})

async function onStartApplication(){
  console.log("onStartApplicationCalled!")
  console.log("waiting for league")
  connection = await authenticate({
      awaitConnection: true,
      pollInterval: 2500
  })
  mainWindow.webContents.send('leagueFound', null)
  console.log("league found!")
}