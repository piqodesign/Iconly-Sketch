import BrowserWindow from 'sketch-module-web-view'
import { getWebview } from 'sketch-module-web-view/remote'
import UI from 'sketch/ui'
import sketch from "sketch/dom";

const webviewIdentifier = 'iconly.webview'
  
var msgs = [
"Keep going! 👌",
"Nice choice! 🤩",
"Hummm, great! 🔥",
"Looks good! 👀",
"Here you go! 😎",
"Let's do this! 🚀",
"That rocks! 🤘",
];


function random(min , max){
  return Math.floor((Math.random() * (max - min + 1) + min));
}

export default function () {
  const options = {
    identifier: webviewIdentifier,
    width: 380,
    height: 560,
    show: false,
    backgroundColor: '#fff',
    resizable: false,
  }

  const browserWindow = new BrowserWindow(options)

  // only show the window when the page has loaded to avoid a white flash
  browserWindow.once('ready-to-show', () => {
    browserWindow.show()
  })

  const webContents = browserWindow.webContents

  // print a message when the page loads
  webContents.on('did-finish-load', () => {
    //UI.message('UI loaded!')
  })

  webContents.on('externalLinkClicked', url => {
    NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString(url))
  })

  // add a handler for a call from web content's javascript
  webContents.on('nativeLog', options => {
    let {icon , name} = JSON.parse(options);
    const group = sketch.createLayerFromData(icon , "svg");
    group.name = name;  
    let document = sketch.getSelectedDocument()
    for (var i = 0; i < document.selectedLayers.length; i++) {  
      const layer = document.selectedLayers.layers[i]
      if( 'Artboard'!=layer.type )  continue
      centerizeGroup(layer.frame , group);
      group.parent = layer;
      UI.message(msgs[random(0,msgs.length - 1)]);
      return;
  }
    let page = document.selectedPage
    
    // centerizeGroup(page.frame , group);
    group.frame.x = 500;
    group.frame.y = 500;
    group.parent = page;
    UI.message(msgs[random(0,msgs.length - 1)]);

  })

  browserWindow.loadURL(require('../resources/webview.html'))
}

function centerizeGroup(frame , group){
  group.frame.x = frame.width / 2 - group.frame.width / 2;
  group.frame.y = frame.height / 2 - group.frame.height / 2;
}
// When the plugin is shutdown by Sketch (for example when the user disable the plugin)
// we need to close the webview if it's open
export function onShutdown() {
  const existingWebview = getWebview(webviewIdentifier)
  if (existingWebview) {
    existingWebview.close()
  }
}
