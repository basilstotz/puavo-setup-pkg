const io  = require("socket.io-client");
const fs = require('fs');


///////////////////////////////////////////////////////////////////////////////////////////////

function debug(text){
    if(false)console.log(text);
}


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
		 	    release: releaseName,
			    name: imageName,
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
    debug('info: connect');
}

function stopStatusUpdate(){
    clearInterval(timerId);
    debug('info: disconnect');
}

//////////////////////////////////////////////////////////////////////////////////////////////


let interval=1*(60*1000);

//globals
let serverUrl;


let hostType;
let hostName;
let imageName;
let releaseName;

let timerId;
let socket;
let oldStatus = {};


debug('info: start');

serverUrl=process.argv[2];
hostName=process.argv[3];
hostType=process.argv[4];
imageName=process.argv[5];
releaseName=process.argv[6];

let startTime= new Date().getTime();

socket=io(serverUrl);    

socket.on('connect', () => {
    socket.volatile.emit('hello', {
	hostname: hostName,
	hosttype: hostType,
	starttime: startTime,
	image: imageName,
	release: releaseName
    });
    if(hostType=='laptop')startStatusUpdate()
});

socket.on('disconnect', () => {
    if(hostType=='laptop')stopStatusUpdate()
});

