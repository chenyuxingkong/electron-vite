const {shell} = require('electron')

export async function openBrowserPage(url) {
    await shell.openExternal(url)
}
