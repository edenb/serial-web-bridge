[![Dependencies](https://img.shields.io/david/edenb/serial-web-bridge.svg)](https://david-dm.org/edenb/serial-web-bridge)
[![DevDependencies](https://img.shields.io/david/dev/edenb/serial-web-bridge.svg)](https://david-dm.org/edenb/serial-web-bridge?type=dev)
# Serial Web Bridge
The Serial Web Bridge provides access to your local serial ports from the browser. The bridge accesses the serial ports and acts as a local server for the web browser. Communication between this server and the browser is based on [Socket.IO](https://socket.io).

![GitHub Logo](/docs/img/overview.png)

## Demo
This project provides a simple example that works similar to the Arduino Serial Monitor.

Open a terminal and get the code:
```bash
git clone https://github.com/edenb/serial-web-bridge.git
cd serial-web-bridge
npm install
```

Start the Serial Web Bridge:
```bash
npm start
```
Open the [demo](./examples/arduino-serial-monitor/arduino-serial-monitor.html) in your browser.
