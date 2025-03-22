const { ipcRenderer } = require('electron');
const XLSX = require('xlsx');

let contacts = [];

document.getElementById('loadExcel').addEventListener('click', () => {
  const fileInput = document.getElementById('excelFile');
  if (fileInput.files.length === 0) {
    alert('Selecione um arquivo Excel.');
    return;
  }
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    contacts = XLSX.utils.sheet_to_json(worksheet);
    displayContacts();
  };
  reader.readAsArrayBuffer(file);
});

function displayContacts() {
  const container = document.getElementById('contacts-list');
  container.innerHTML = '';
  if (!contacts.length) {
    container.innerHTML = '<p>Nenhum contato encontrado.</p>';
    return;
  }
  const list = document.createElement('ul');
  list.className = 'list-group';
  contacts.forEach(contact => {
    const item = document.createElement('li');
    item.className = 'list-group-item';
    item.textContent = `${contact.nome} - ${contact.numero}`;
    list.appendChild(item);
  });
  container.appendChild(list);
}

let whatsappStatus = document.getElementById('login-status');
ipcRenderer.on('whatsapp-qr', (event, qr) => {
  const qrContainer = document.getElementById('qr');
  qrContainer.innerHTML = '';
  const qrCodeImg = document.createElement('img');
  qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}&size=300x300`;
  qrContainer.appendChild(qrCodeImg);
});

ipcRenderer.on('whatsapp-ready', (event, message) => {
  whatsappStatus.textContent = message;
  document.getElementById('qr').innerHTML = '';
});

ipcRenderer.on('whatsapp-status', (event, message) => {
  whatsappStatus.textContent = message;
});

function sendMessages() {
  const messageTemplate = document.getElementById('messageText').value;
  const scheduleTime = document.getElementById('scheduleTime').value;
  
  if (!contacts.length) {
    alert('Nenhum contato carregado.');
    return;
  }
  if (!messageTemplate) {
    alert('Escreva uma mensagem.');
    return;
  }

  let sendFunction = () => {
    let index = 0;
    function sendNext() {
      if (index < contacts.length) {
        let contact = contacts[index];
        let personalizedMessage = messageTemplate.replace(/{nome}/g, contact.nome);
        ipcRenderer.send('send-message', contact, personalizedMessage);
        index++;
        setTimeout(sendNext, 1000); // 1 segundo de intervalo
      }
    }
    sendNext();
  };

  if (scheduleTime) {
    let scheduledDate = new Date(scheduleTime);
    let delay = scheduledDate.getTime() - Date.now();
    if (delay > 0) {
      setTimeout(sendFunction, delay);
      alert('Mensagens agendadas para ' + scheduledDate.toLocaleString());
    } else {
      alert('Horário agendado inválido.');
    }
  } else {
    sendFunction();
  }
}

ipcRenderer.on('message-status', (event, data) => {
  let dashboardBody = document.getElementById('dashboardBody');
  let row = document.createElement('tr');
  row.innerHTML = `<td>${data.nome}</td><td>${data.numero}</td><td>${data.status}</td>`;
  dashboardBody.appendChild(row);
});
