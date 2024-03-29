[![Depfu](https://badges.depfu.com/badges/af51a610767605eb8005979acff55c62/overview.svg)](https://depfu.com/github/edenb/serial-web-bridge?project_id=35255)
# Serial Web Bridge
The Serial Web Bridge provides access to your local serial ports from the browser. The bridge accesses the serial ports and acts as a local server for the web browser. Communication between this server and the browser is based on [Socket.IO](https://socket.io).

![Overview](/docs/img/overview.png)

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
Open `<your working dir>\serial-web-bridge\examples\arduino-serial-monitor.html` in a web browser.

The example below shows a browser controlling an ESP Easy device over the serial port.

![Screendump](/docs/img/screendump.png)
