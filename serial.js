'use strict'
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
// The InterByteTimeout parser is not part of the NPM modules, so line below doesn't work
//const InterByteTimeout = require('@serialport/parser-inter-byte-timeout')
const InterByteTimeout = require('./parser-inter-byte-timeout')
const EventEmitter = require('events');

module.exports = class Serial extends EventEmitter {
  constructor() {
    // Call EventEmitter constructor
    super();
    this.scanTimer = null;
    this.port = null;
  }
  create(path, baudRate, parser, parserOptions) {
    let newPort = new SerialPort(path, { autoOpen: false, baudRate: baudRate });
    newPort.on('open', () => {
      this.emit('open');
    })
    newPort.on('close', () => {
      this.emit('close');
    })
    let newParser = {};
    switch (parser) {
      case 'Readline':
        // Example options: { delimiter: '\r\n' }
        newParser = this.port.pipe(new Readline(parserOptions));
        break;
      case 'InterByteTimeout':
        // Example options: {interval: 100, maxBufferSize: 4096}
        newParser = newPort.pipe(new InterByteTimeout(parserOptions));
        break;
      default:
        // Readline = default parser
        newParser = this.port.pipe(new Readline({ delimiter: '\r\n' }));
    }
    newParser.on('data', (data) => {
      this.emit('data', data);
    })
    return newPort;
  }
  open(path, baudRate, parser, parserOptions) {
    // Create a new port if it doesn't exist or the port settings have changed
    if (this.port === null || this.port.path !== path || this.port.baudRate !== baudRate) {
      this.port = this.create(path, baudRate || 115200, parser || '', parserOptions || {});
    }
    // Only open the port if it is closed
    if (!this.port.isOpen) {
      this.port.open((err) => {
        if (err) {
          return console.log('Error opening port: ', err.message)
        }
      });
    }
  }
  close() {
    // Gracefull close port if exists and open
    if (this.port !== null && this.port.isOpen) {
      this.port.close((err) => {
        if (err) {
          return console.log('Error closing port: ', err.message)
        }
      });
    }
  }
  write(data) {
    if (this.port !== null) {
      this.port.write(data);
    }
  }
  isOpen() {
    // If the port doesn't exist return false (not open)
    if (this.port === null) {
      return false;
    } else {
      return this.port.isOpen;
    }
  }
  startScan(interval, productVendorList) {
    // Remove previous timer
    if (this.scanTimer !== null) {
      clearInterval(this.scanTimer)
      this.scanTimer = null;
    }
    this.scanTimer = setInterval(() => {
      this.singleScan(productVendorList)
        .then((portList) => {
          this.emit('scanready', portList);
        })
        .catch((err) => {
          console.log(err);
        })
    }, interval < 1 ? 1000:interval*1000);
  }
  stopScan() {
    // Remove previous timer
    if (this.scanTimer !== null) {
      clearInterval(this.scanTimer)
      this.scanTimer = null;
    }
  }
  singleScan(productVendorList) {
    if (!productVendorList) {
      productVendorList = [];
    }
    return new Promise((resolve, reject) => {
      SerialPort.list()
        .then((ports, err) => {
          if (err) {
            reject(err);
          }
          let portList = [];
          ports.forEach(port => {
            let whitelisted = false;
            productVendorList.forEach(productVendor => {
              if (port.vendorId &&
                port.productId &&
                productVendor.vid.toLowerCase() === port.vendorId.toLowerCase() &&
                productVendor.pid.toLowerCase() === port.productId.toLowerCase()) {
                whitelisted = true;
              }
            })
            if (productVendorList.length === 0 || whitelisted) {
              portList.push({path: port.path, vid: port.vendorId, pid: port.productId});
            }
          });
          resolve(portList);
        })
    })
  }
}
