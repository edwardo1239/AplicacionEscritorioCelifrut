const http = require('node:http');
const net = require('node:net');
const { URL } = require('node:url');
const os = require('os');
const interfaces = os.networkInterfaces();
const {parentPort} = require('node:worker_threads')

const hostname = '192.168.0.152';
const port = 3000;

// for (let interfaz in interfaces) {
//   for (let interfazInfo of interfaces[interfaz]) {
//     if (interfazInfo.family === 'IPv4' && !interfazInfo.internal) {
//       console.log(interfazInfo.address);
//     }
//   }
// }

 
const server = http.createServer((req, res) => {

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-type', 'application/json; charset=UTF-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

  if(req.method === 'POST'){
    let body = ''
    req.on('data', chunk =>{
      body += chunk; 
      console.log(body)
    });
    
    req.on('end', () => {
      res.writeHead(200, { "Content-Type": "text/html" });
      let data = JSON.stringify('Este es el servidor de la app de celifrut POST')
      res.end(data);
    });
  } else if(req.method === 'GET'){
    let data = JSON.stringify('Este es el servido de la app de celifrut')
    res.end(data);
  }
  else{
    let data = JSON.stringify('Mero loco esto')
    res.end(data);
  }
  res.statusCode = 200;
});



server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});



parentPort.postMessage('worker');
