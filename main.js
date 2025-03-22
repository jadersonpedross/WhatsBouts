const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
const path = require('path');
const puppeteer = require('puppeteer');
const { Client, LocalAuth } = require('whatsapp-web.js');

let mainWindow;
let tray;
let whatsappClient;

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.show();
            mainWindow.focus();
        }
    });

    function createWindow() {
        mainWindow = new BrowserWindow({
            width: 800,
            height: 600,
            icon: path.join(__dirname, 'icon.png'),
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        });

        mainWindow.loadFile('index.html');

        mainWindow.on('close', (event) => {
            if (!app.isQuiting) {
                event.preventDefault();
                mainWindow.hide();
            }
            return false;
        });
    }

    function initializeWhatsApp() {
        whatsappClient = new Client({
            authStrategy: new LocalAuth({
                clientId: "whatsapp-batch-sender",
                dataPath: app.getPath('userData')
            }),
            clientId: 'whatsapp-batch-sender',
            puppeteer: {
                headless: true,
                executablePath: puppeteer.executablePath()
            }
        });

        whatsappClient.on('qr', (qr) => {
            console.log('EVENT QR:', qr);
            mainWindow.webContents.send('whatsapp-qr', qr);
        });

        whatsappClient.on('ready', () => {
            console.log('EVENT READY');
            mainWindow.webContents.send('whatsapp-ready', 'WhatsApp conectado!');
        });

        whatsappClient.on('authenticated', () => {
            console.log('EVENT AUTHENTICATED');
            mainWindow.webContents.send('whatsapp-status', 'Autenticado');
        });

        whatsappClient.on('auth_failure', (msg) => {
            console.error('EVENT AUTH FAILURE:', msg);
            mainWindow.webContents.send('whatsapp-status', 'Falha na autenticação');
        });

        whatsappClient.initialize().catch(err => {
            console.error('Erro ao inicializar o WhatsApp Client:', err);
        });
    }

    app.on('ready', () => {
        createWindow();
        initializeWhatsApp();

        tray = new Tray(path.join(__dirname, 'icon.png'));
        const contextMenu = Menu.buildFromTemplate([
            { label: 'Mostrar', click: () => { mainWindow.show(); } },
            { label: 'Sair', click: () => { app.isQuiting = true; app.quit(); } }
        ]);
        tray.setToolTip('WhatsApp for Agimob');
        tray.setContextMenu(contextMenu);
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    ipcMain.on('send-message', async (event, contact, message) => {
        try {
            let phoneNumber = formatBrazilNumber(contact.numero);
            let chatId = phoneNumber + '@c.us';
            await whatsappClient.sendMessage(chatId, message);
            event.reply('message-status', {
                nome: contact.nome,
                numero: phoneNumber,
                status: 'Enviado'
            });
        } catch (error) {
            event.reply('message-status', {
                nome: contact.nome,
                numero: contact.numero,
                status: 'Erro'
            });
        }
    });

    function formatBrazilNumber(number) {
        let numStr = number.toString().replace(/\D/g, '');
        if (numStr.length === 10 || numStr.length === 11) {
            numStr = '55' + numStr;
        }
        if (numStr.length === 13 && numStr.charAt(4) === '9') {
            numStr = numStr.slice(0, 4) + numStr.slice(5);
        }
        return numStr;
    }
}