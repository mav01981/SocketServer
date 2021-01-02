const httpServer = require('http').createServer((req, res) => {
  let file;
  switch (req.url) {
    case "/":
      file = '/index.html';
      break;
    case "/wiki":
      file = '/wiki.html';
      break;
    default:
      file = '/index.html';
      break;
  }

  const content = require('fs').readFileSync(__dirname + file, 'utf8');
  // serve the index.html file
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(content));
  res.end(content);
});

const io = require('socket.io')(httpServer);

io.on("connection", socket => {
  console.log("user connected ");

  // Log whenever a client disconnects from our websocket server
  socket.on("disconnect", function () {
    console.log("user disconnected");
  });

  // When we receive a 'message' event from our client, print out
  // the contents of that message and then echo it back to our client
  // using `io.emit()`
  socket.on("message", message => {
    console.log("Message Received: " + JSON.stringify(message));
    io.emit("notifyClient", JSON.stringify({ 'id': socket.id, 'message': message }));
  });
});

httpServer.listen(8080, () => {
  console.log("Socket Server listening on port 8080");
});

