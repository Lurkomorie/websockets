module.exports = function (app) {
  const WebSocket = require('ws');
  const clients = [];

  const wss = new WebSocket.Server({ port: 3002 });

  wss.on('connection', function connection(socket) {
    socket.on('message', function incoming(message) {
      const data = JSON.parse(message);

      switch (data.type) {
        case 'connect': {
          if (clients.length) {
            clients
                .forEach((client) => {
                  client.socket.send(
                      JSON.stringify(
                          data
                      ),
                  )}
                );
          }
          clients.push({
            socket,
          });
          break;
        }

        case 'toggle': {
          clients
            .forEach((client) => {
              client.socket !== socket &&
              client.socket.send(
                JSON.stringify(
                    data
                ),
              )}
            );
          break;
        }
      }
    });

    socket.on('close', function close() {
      const client = clients.find((c) => c.socket === socket);
      if (!client) return;
      console.log('Closing' + client);
      clients.splice(clients.indexOf(client), 1);
    });
  });
};
