const Serial = require('./serial');
const socketio = require('socket.io');

const info = {version: '1.0.0'};

// Create Socket IO server
const io = socketio();

io.on('connection', client => {
  console.log('Socket connected')
  if (serial.isOpen()) {
    io.emit('port', true, serial.path, '');
  } else {
    io.emit('port', false, '', '');
  }
  client.on('info', () => {
    io.emit('info', info);
  }),
  client.on('open', (path, baudRate, parser, parserOptions) => {
    serial.open(path, baudRate, parser, parserOptions);
  }),
  client.on('close', () => {
    serial.close();
  }),
  client.on('write', (data) => {
    serial.write(data);
  }),
  client.on('startscan', (interval, whitelist) => {
    serial.startScan(interval || 1, whitelist || []);
  }),
  client.on('stopscan', () => {
    serial.stopScan();
  }),
  client.on('disconnect', () => {
    // Stop scanning for ports and close port
    serial.stopScan();
    serial.close();
    console.log('Socket disconnected')
  })
});

// Create serial port manager
const serial = new Serial();

serial.on('open', (path, err) => {
  io.emit('port', true, path, err);
  console.log('Port is open');
});

serial.on('close', (path, err) => {
  io.emit('port', false, path, err);
  console.log('Port is closed');
});

serial.on('data', (data) => {
  io.emit('read', data);
  console.log(data);
});

serial.on('scanready', (portList) => {
  io.emit('scanready', portList);
  console.log(portList);
});

// Start Socket IO server
io.listen(4000, {
  cookie: false,
  cors: {
    origin: "*"
  }
});
