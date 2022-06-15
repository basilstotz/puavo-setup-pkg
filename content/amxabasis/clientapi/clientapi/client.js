const io  = require("socket.io-client");
const fs = require('fs');
const { execSync } = require('child_process')

///////////////////////////////////////////////////////////////////////////////////////////////

function debug(text){
    if(false)console.log(text);
}


//blocking
function read(name){
    return fs.readFileSync(name,{encoding:'utf8', flag:'r'});
}

function shell(command){
    let args= [];
    //console.log(args);
    let opts= { encoding: 'utf8' };
    return execSync(command, args, opts);
}


function getHostType(){
    return shell('puavo-conf puavo.hosttype 2>/dev/null').replace(/\n/g,'');
}

function getImageName(){
    return read('/etc/puavo-image/name').replace(/\n/g,'');
}

function getRelease(){
    return read('/etc/puavo-image/release').replace(/\n/g,'');
}

function getHostname(){
    let hn=shell('hostname').replace(/\n/g,'');
    echo 
    return 
}


/*
function getUsers(){
    return shell('who').replace(/\n/g,'');
}

function shutdown(){
    shell('shutdown --now');
}
*/

function lookupImageServer(){
    let ans=shell('/usr/lib/puavo-ltsp-client/lookup-image-server-by-dns').replace(/\n/g,'');;
    if(ans==''){
	return '';
    }else{
	let arr=ans.split(':');
	return arr[0];
    }
}

//nonblocking


function doStatusUpdate(){
    debug('status');
    if(oldStatus.phase!='finished'){
	fs.readFile('/images/image_update.stats', 'utf-8',function(err, content) {
	    if (err) {
		console.error(err);
		return;
	    }
	    var arr=content.replace(/\n/g,' ').split(' ');
	    let image=arr[1];
	    let phase=arr[3];
	    let progress=arr[5];
	    let status=
		{
		    image: image,
	            phase: phase,
	            progress: progress
		};
	    if(oldStatus.image!=status.image || oldStatus.phase!=status.phase || oldStatus.progress!=status.progress){
		let fullStatus=
		    {
			host: hostName,
			image: {
		 	    release: release,
			    name: imageName
			},
			update: status
		    };
		socket.volatile.emit('update', fullStatus);
		debug(JSON.stringify(fullStatus,null,2));
	    }
	    oldStatus=status;
	})
    }
}


function startStatusUpdate(){
    setImmediate(doStatusUpdate);
    timerId=setInterval(doStatusUpdate,interval);
    debug('connect');
}

function stopStatusUpdate(){
    clearInterval(timerId);
    debug('disconnect');
}

function sleepForever(){
    setTimeout(sleepForever,3600000);
}

/*
function doCommand(data) {
    if(data.host==hostname){
	
        switch(data.command){
	    
	    'update':
	    
	    shell('puavo-update-client');
	    break;
	    
	    'reboot': 
	   shell('reboot');
		'shutdown':
		shell('shutdown -now');
	    default:
	    }
    }
}
*/

//////////////////////////////////////////////////////////////////////////////////////////////

//settings
let interval=1*(60*1000);
let port=3000;

//globals
let hostType;
let hostName;
let imageName;
let release;
let timerId;
let socket;
let oldStatus = {};

let imageServer=lookupImageServer();
//let imageServer='192.168.1.112';
if(imageServer!=''){
    debug('start');
    hostName = getHostname();
    hostType = getHostType();
    if(hostType=='laptop'){
    	imageName = getImageName();        release = getRelease();
    }
    socket=io('ws://'+imageServer+':'+port);    
    socket.on('connect', () => {
	socket.volatile.emit('hello', { hostname: hostName, hosttype: HostType } );
	if(hostType=='laptop')startStatusUpdate()
    });
    socket.on('disconnect', () => {
	if(hostType=='laptop')stopStatusUpdate()
    });
//    socket.on('command', (data) => { doCommand(data) }); 
}else{
    sleepForvever();
    debug('sleep');
}
 
