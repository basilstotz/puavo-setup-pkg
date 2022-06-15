var express = require('express');
var fs = require('fs');
var app = express();
const { execFile } = require('child_process');

var deviceInfo={};
var updateInfo={}
var onlineInfo={};

var changedHostInfo=false;

////////////////////////////////////////////////////////////////////////////////////

function write(name,content){
   fs.writeFile(name,  content , function (err) {
      if (err) throw err;
      //console.log('Saved '+name);
   });
}

function read(name){
    return fs.readFileSync(name,{encoding:'utf8', flag:'r'})
}


function appendLog(item){
    fs.appendFile('clients.log', item, (err)=>{});
}

function readUpdateInfo(){
    console.log('Read HostInfo');
    hostInfo=JSON.parse(read('/var/log/clientapi/updateinfo.json'));
    console.log(JSON.stringify(hostInfo,null,2));
}

    
function writeUpdateInfo(theCallback){
    //console.log('Write HostInfo');
    if(changedHostInfo)write('/var/log/clientapi/updateinfo.json', JSON.stringify(hostInfo,null,2));
    changedHostInfo=false;
    if(theCallback)theCallback();
}

function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('listening at http://' + host + ':' + port);
}


function filterRestDevices(devices){
    var result={};
    devices.forEach(function(device){
	if( device.type=="laptop" && device.school_dn=="puavoId=227086,ou=Groups,dc=edu,dc=basel,dc=fi"){
	    if(!device.hw_info){
		hi={ timestamp: null, this_image: "", this_release: "" };
	    }else{
		hi=JSON.parse(device.hw_info);
		hi.timestamp*=1000;
	    }
	    rec= {
		host: device.hostname,
		hosttype: device.hosttype,
		time: hi.timestamp,
		image: hi.this_image,
		release: hi.this_release
	    };
	    result[device.hostname]=rec;
	}
    });
    return result;
}

function getDeviceInfo(theCallback){
    execFile('puavo-rest-client', ['--user-etc', '/v3/devices'], function(error, stdout, stderr){
        if (error) {
	   throw error;
        }
	deviceInfo=filterRestDevices(JSON.parse(stdout));
        if(theCallback)theCallback();
    }) 
}

function updateFiles(){
    getDeviceInfo();
    writeUpdateUnfo();
}

function readDeviceInfo(){
    deviceInfo=filterRestDevices(JSON.parse(read('./devices.json')));
}

function cleanupAndExit(){
    server.close( () => {
	writeUpdateInfo( ()=>{
	    process.exit(0);
	})
    })
}    
/////////////////////////////////////////////////////////////////////////////////////



readDeviceInfo();
readUpdateInfo();
setInterval(writeUpdateInfo, 60000);

/*
readUpdateInfo();
getDeviceInfo();
setInterval(updateFiles,3600*1000);
*/

var server = app.listen(process.env.PORT || 3000, listen);

process.on('SIGINT', () => {
    console.log('\nSIGINT received. cleanup and exit');
    cleanupAndExit();
});

//for systemd
process.on('SIGTERM', () => {
    console.log('\nSIGTERM received. cleanup and exit');
    cleanupAndExit();
});

var io = require('socket.io')(server);

io.sockets.on('connection', function (socket) {

      var hostname;
      
      
      console.log("We have a new client: " + socket);


      socket.on('hello', function(data){

	  // "data": { "hostName": "fat-004", "hostType": "faclient" }

	  hostname=data.hostname;	  

	  data.time=new Date().getTime();
	  onlineInfo[hostname]=data;
      });

      socket.on('update', function(data) {

	  /*
	  "data" :{
	    "host": "puavo-builder",
	    "image": "puavo-os-amxa-buster-2022-06-04-231400-amd64.img",
	    "update": {
	      "image": "puavo-os-amxa-buster-2022-06-04-231400-amd64.img",
	      "phase": "finished",
	      "progress": "100"
	    }
	  }
	  */

	  data.time=new Date().getTime();
	  updateInfo[hostname]=data;
	  changedHostInfo=true;
	  //console.log(JSON.stringify(hostInfo,null,2)+'\n');

      });
    
      socket.on('disconnect', function() {
          if(onlineInfo[hostname]){
	      let time=new Date().getTime();
	      onlineInfo[hostname].duration=time-onlineInfo[hostname].time;
	      fs.appendFile('./var/log/clientapi/clients.log',',\n'+JSON.stringify(onlineInfo[hostname]), (err)=>{
	          delete onlineInfo[hostname];
	      });
	  }
	  console.log('Client '+hostname+' has disconnected');
      });
  }
);


app.use(express.static('public'));
/*
deviceInfo: {
    host: device.hostname,
    hosttype: device.hosttype,
    time: hi.timestamp,
    image: hi.this_image,
    release: hi.this_release
}

updateInfo: {
    "host": "puavo-builder",
    "image": "puavo-os-amxa-buster-2022-06-04-231400-amd64.img",
    "update": {
      "image": "puavo-os-amxa-buster-2022-06-04-231400-amd64.img",
      "phase": "finished",
      "progress": "100"
    }
}
*/

app.get('/hostinfo', (req, res) => {
    let time,online;
    let ans=[];
    //console.log(JSON.stringify(online));
    Object.entries(deviceInfo).forEach(([hostname, device]) => {
	if(updateInfo[hostname]){
	    update=updateInfo[hostname];
	}else{
	    update={ time: null, update: { image: '', phase: '', progress: '' }};
	}
	if(update.time){time=update.time}else{time=device.time};
	if(onlineInfo[hostname]){online=true}else{online=false}; 
	rec={
	    host: device.host,
	    hosttype: device.hosttype,
	    time: time,
            image: device.image,
	    update: update.update.image,
	    phase: update.update.phase,
	    progress: update.update.progress, 
	    online: online
	};
	ans.push(rec);
    });
    res.send(JSON.stringify(ans)+'\n');
});



/*
app.get('/do/:host/:command', (req, res) => {
    let host=req.param['host'];
    let command=req.param['command'];

    let message= { host: host, command: command };
    io.sockets.emit(message);
    
    res.send('ok');
});
*/

