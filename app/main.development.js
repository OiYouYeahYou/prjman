const path = require('path')

const { app, BrowserWindow, Menu, shell } = require('electron')
const windowStateManager = require('electron-window-state')

// Disabling security messages because I can not
// figure out how to fix what should be fixed
// https://electronjs.org/docs/tutorial/security
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true

if (process.env.NODE_ENV === 'production') {
	const sourceMapSupport = require('source-map-support')
	sourceMapSupport.install()
}

if (process.env.NODE_ENV === 'development') {
	require('electron-debug')()
	const p = path.join(__dirname, '..', 'app', 'node_modules')
	require('module').globalPaths.push(p)
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})

const installExtensions = () => {
	if (process.env.NODE_ENV !== 'development') {
		return Promise.resolve()
	}

	const installer = require('electron-devtools-installer')
	const { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = installer
	const forceDownload = !!process.env.UPGRADE_EXTENSIONS

	return Promise.all([
		installer.default(REACT_DEVELOPER_TOOLS, forceDownload),
		installer.default(REDUX_DEVTOOLS, forceDownload),
	])
}

app.on('ready', () =>
	installExtensions().then(() => {
		let mainWindowState = windowStateManager({
			defaultWidth: 1024,
			defaultHeight: 728,
		})

		let mainWindow = new BrowserWindow({
			show: false,
			x: mainWindowState.x,
			y: mainWindowState.y,
			width: mainWindowState.width,
			height: mainWindowState.height,
			icon: path.join(__dirname, '..', 'resources', 'icons', '64x64.png'),

			webPreferences: {
				nodeIntegration: true,
			},
		})

		mainWindowState.manage(mainWindow)

		mainWindow.loadURL(`file://${__dirname}/app.html`)

		mainWindow.webContents.on('did-finish-load', () => {
			mainWindow.show()
			mainWindow.focus()
		})

		mainWindow.on('closed', () => (mainWindow = null))

		if (process.env.NODE_ENV === 'development') {
			mainWindow.openDevTools()
			mainWindow.webContents.on('context-menu', (e, props) =>
				Menu.buildFromTemplate([
					{
						label: 'Inspect element',
						click() {
							mainWindow.inspectElement(props.x, props.y)
						},
					},
				]).popup(mainWindow)
			)
		}

		{
			const template = crreateMenuTemplate(mainWindow)
			const menu = Menu.buildFromTemplate(template)

			if (process.platform === 'darwin') {
				Menu.setApplicationMenu(menu)
			} else {
				mainWindow.setMenu(menu)
			}
		}
	})
)

function crreateMenuTemplate(mainWindow) {
	if (process.platform === 'darwin') {
		return [
			{
				label: 'Electron',
				submenu: [
					{
						label: 'About ElectronReact',
						selector: 'orderFrontStandardAboutPanel:',
					},
					{
						type: 'separator',
					},
					{
						label: 'Services',
						submenu: [],
					},
					{
						type: 'separator',
					},
					{
						label: 'Hide ElectronReact',
						accelerator: 'Command+H',
						selector: 'hide:',
					},
					{
						label: 'Hide Others',
						accelerator: 'Command+Shift+H',
						selector: 'hideOtherApplications:',
					},
					{
						label: 'Show All',
						selector: 'unhideAllApplications:',
					},
					{
						type: 'separator',
					},
					{
						label: 'Quit',
						accelerator: 'Command+Q',
						click() {
							app.quit()
						},
					},
				],
			},
			{
				label: 'Edit',
				submenu: [
					{
						label: 'Undo',
						accelerator: 'Command+Z',
						selector: 'undo:',
					},
					{
						label: 'Redo',
						accelerator: 'Shift+Command+Z',
						selector: 'redo:',
					},
					{
						type: 'separator',
					},
					{
						label: 'Cut',
						accelerator: 'Command+X',
						selector: 'cut:',
					},
					{
						label: 'Copy',
						accelerator: 'Command+C',
						selector: 'copy:',
					},
					{
						label: 'Paste',
						accelerator: 'Command+V',
						selector: 'paste:',
					},
					{
						label: 'Select All',
						accelerator: 'Command+A',
						selector: 'selectAll:',
					},
				],
			},
			{
				label: 'View',
				submenu:
					process.env.NODE_ENV === 'development'
						? [
								{
									label: 'Reload',
									accelerator: 'Command+R',
									click() {
										mainWindow.webContents.reload()
									},
								},
								{
									label: 'Toggle Full Screen',
									accelerator: 'Ctrl+Command+F',
									click() {
										mainWindow.setFullScreen(
											!mainWindow.isFullScreen()
										)
									},
								},
								{
									label: 'Toggle Developer Tools',
									accelerator: 'Alt+Command+I',
									click() {
										mainWindow.toggleDevTools()
									},
								},
						  ]
						: [
								{
									label: 'Toggle Full Screen',
									accelerator: 'Ctrl+Command+F',
									click() {
										mainWindow.setFullScreen(
											!mainWindow.isFullScreen()
										)
									},
								},
						  ],
			},
			{
				label: 'Window',
				submenu: [
					{
						label: 'Minimize',
						accelerator: 'Command+M',
						selector: 'performMiniaturize:',
					},
					{
						label: 'Close',
						accelerator: 'Command+W',
						selector: 'performClose:',
					},
					{
						type: 'separator',
					},
					{
						label: 'Bring All to Front',
						selector: 'arrangeInFront:',
					},
				],
			},
			{
				label: 'Help',
				submenu: [
					{
						label: 'Learn More',
						click() {
							shell.openExternal('http://electron.atom.io')
						},
					},
					{
						label: 'Documentation',
						click() {
							shell.openExternal(
								'https://github.com/atom/electron/tree/master/docs#readme'
							)
						},
					},
					{
						label: 'Community Discussions',
						click() {
							shell.openExternal(
								'https://discuss.atom.io/c/electron'
							)
						},
					},
					{
						label: 'Search Issues',
						click() {
							shell.openExternal(
								'https://github.com/atom/electron/issues'
							)
						},
					},
				],
			},
		]
	} else {
		return [
			{
				label: '&File',
				submenu: [
					{
						label: '&Open',
						accelerator: 'Ctrl+O',
					},
					{
						label: '&Close',
						accelerator: 'Ctrl+W',
						click() {
							mainWindow.close()
						},
					},
				],
			},
			{
				label: '&View',
				submenu:
					process.env.NODE_ENV === 'development'
						? [
								{
									label: '&Reload',
									accelerator: 'Ctrl+R',
									click() {
										mainWindow.webContents.reload()
									},
								},
								{
									label: 'Toggle &Full Screen',
									accelerator: 'F11',
									click() {
										mainWindow.setFullScreen(
											!mainWindow.isFullScreen()
										)
									},
								},
								{
									label: 'Toggle &Developer Tools',
									accelerator: 'Alt+Ctrl+I',
									click() {
										mainWindow.toggleDevTools()
									},
								},
						  ]
						: [
								{
									label: 'Toggle &Full Screen',
									accelerator: 'F11',
									click() {
										mainWindow.setFullScreen(
											!mainWindow.isFullScreen()
										)
									},
								},
						  ],
			},
			{
				label: 'Help',
				submenu: [
					{
						label: 'Learn More',
						click() {
							shell.openExternal('http://electron.atom.io')
						},
					},
					{
						label: 'Documentation',
						click() {
							shell.openExternal(
								'https://github.com/atom/electron/tree/master/docs#readme'
							)
						},
					},
					{
						label: 'Community Discussions',
						click() {
							shell.openExternal(
								'https://discuss.atom.io/c/electron'
							)
						},
					},
					{
						label: 'Search Issues',
						click() {
							shell.openExternal(
								'https://github.com/atom/electron/issues'
							)
						},
					},
				],
			},
		]
	}
}
