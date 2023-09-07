
const {parentPort} = require('node:worker_threads');

// export default function (){
    console.log('I am a worker')

    let x = "from worker"
    //return x

//}
 

parentPort.postMessage(x)