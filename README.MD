# WhatsApp for Agimob

Esse projeto é uma aplicação desktop feita com Electron para automatizar o envio de mensagens em lotes via WhatsApp. Ele utiliza a API do [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) junto com o Puppeteer para realizar a automação, além de permitir a importação de contatos a partir de arquivos Excel e o agendamento das mensagens.

## Funcionalidades

- **Autenticação via WhatsApp Web:** Exibe um QR Code para realizar o login no WhatsApp.
- **Envio de Mensagens em Lote:** Permite enviar mensagens personalizadas para uma lista de contatos.
- **Personalização de Mensagens:** Use o marcador `{nome}` para personalizar cada mensagem com o nome do contato.
- **Agendamento de Envio:** Configure um horário para o envio das mensagens.
- **Relatório de Envio:** Visualize um relatório com o status (Enviado/Erro) para cada contato.

## Pré-requisitos

- [Node.js](https://nodejs.org/) (recomendado v14 ou superior)
- npm (geralmente instalado junto com o Node.js)

## Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/agiwhats.git
   cd agiwhats

2. **Instale as dependências::**
   ```bash
    npm install

## Uso

1. **Inicie a Aplicação:**
   ```bash
    npm start

2. **Realize o Login no WhatsApp:**
    Ao iniciar, a aplicação exibirá um QR Code. Abra o WhatsApp no seu celular, acesse o menu de dispositivos e escaneie o código para autenticar.

3. **Carregue a Lista de Contatos:**
    Na aba "Contatos", selecione um arquivo Excel (.xlsx ou .xls) contendo os contatos.
    Certifique-se de que o arquivo contenha pelo menos as colunas nome e numero.

4. **Configure a Mensagem:**
    Na aba "Mensagem", digite o texto que será enviado. Use {nome} para personalização.
    Opcionalmente, defina um agendamento para o envio utilizando o campo "Agendamento" (data e hora).

5. **Envie as Mensagens:**
    Clique em "Enviar Mensagens" para iniciar o processo.
    Um relatório com o status de cada envio será exibido na aba "Relatório".


# Estrutura do Projeto
    **index.html:** Interface gráfica com um wizard para guiar o usuário pelo processo de login, importação de contatos, configuração da mensagem e exibição do relatório.
    **main.js:** Código principal do Electron que cria a janela da aplicação, inicializa o cliente do WhatsApp e gerencia a comunicação via IPC.
    **renderer.js:** Lida com a lógica da interface, incluindo a leitura do arquivo Excel e o envio dos dados para o processo principal.
    **package.json:** Define as dependências, scripts e configurações de build da aplicação.

# Tecnologias Utilizadas
    **Electron:** Para criar a aplicação desktop.
    **whatsapp-web.js:** Para interagir com o WhatsApp Web.
    **Puppeteer:** Para manipulação headless do navegador.
    **XLSX:** Para leitura dos arquivos de contatos.
    **node-schedule:** Para agendamento das mensagens.
    **Bootstrap 4:** Para o layout e design da interface.

# Licença
    Este projeto está licenciado sob a ISC License.

# Autor
    Jaderson Pedrossini
