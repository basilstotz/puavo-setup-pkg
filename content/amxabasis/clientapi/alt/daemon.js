var express = require('express');
const fs = require('fs');
const { execFileSync } = require('child_process')
const {Bonjour} = require('bonjour-service');

const service = new Bonjour()

service.publish({ name: 'PuavoClientApi', type: 'http', port: 3000 })

const browser = service.find({ name: 'puavo' })

browser.on('up', (service) => {
  console.log('up', service)
})

browser.on('down', (service) => {
  console.log('down', service)
})

var app = express();

var server = app.listen(process.env.PORT || 3000, listen);

function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('PuavoClientApi  listening at http://' + host + ':' + port);
}

app.use(express.static('public'));


///////////////////////////////////////////////////////////////////////////////////////////////

function read(name){
    return fs.readFileSync(name,{encoding:'utf8', flag:'r'});
}

function shell(command){
    let args= [ '-c', command ];
    //console.log(args);
    let opts= { encoding: 'utf8' };
    return execFileSync('bash', args, opts);
}

function puavoConf(variable){
    return shell('puavo-conf ' + variable + '2>/dev/null');
}


//////////////////////////////////////////////////////////////////////////////////////////////

function doDevice(req, res) {
    res.send(read('/etc/puavo/device.json')+'\n');
}

function doUpdate(req,res){
    shell('puavo-update-client 2>/dev/null');
    res.send('{ status: "ok" }\n');
}

function doStatus(req,res){
    let stats=read('/images/image_update.stats');
    let content=stats.replace(/\n/g,' ');
    //console.log(JSON.stringify(content));
    let arr=content.split(' ');
    //console.log(JSON.stringify(arr));
    let image=arr[1];
    let phase=arr[3];
    let progress=arr[5];
    let ans= {
	image: image,
	phase: phase,
	progress: progress
    }
    res.send(JSON.stringify(ans)+'\n');
}


app.get('/device', doDevice);
app.get('/update', doUpdate);

app.get('/status', doStatus);

function doThing(req, res) {
  // Query String
  var name = req.params['name'];
  // If there is no num keep it as 1
  var num = req.params['num'] || 1;

  // Create the output
  var output = '';
  for (var i = 0; i < num; i++) {
    output += "Thanks for doing your thing, " + name + '<br/>';
  }
  res.send(output);
}
