const io  = require("socket.io-client");
const fs = require('fs');
const { execFileSync } = require('child_process')

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
    return shell('puavo-conf ' + variable + '2>/dev/null').replace(/\n/g,'');;
}

function getImage(){
    let image=read('/etc/puavo-image/name').replace(/\n/g,'');
    return image;
}

function getHostname(){
    return shell('hostname').replace(/\n/g,'');
}

function getUsers(){
    return shell('who').replace(/\n/g,'');
}

function halt(){
    shell('halt');
}

function lookupImageServer(){
    let ans=shell('/usr/lib/puavo-ltsp-client/lookup-image-server-by-dns').replace(/\n/g,'');;
    if(ans==''){
	return '';
    }else{
	let arr=ans.split(':');
	return arr[0];
    }
}

function getStatus(){
    let stats=read('/images/image_update.stats');
    let content=stats.replace(/\n/g,' ');
    let arr=content.split(' ');
    let image=arr[1];
    let phase=arr[3];
    let progress=arr[5];
    let ans= {
	image: image,
	phase: phase,
	progress: progress
    };
    return ans;
}


//////////////////////////////////////////////////////////////////////////////////////////////
//globals
//let hostType=getHostType();

//client globals
let connected=false;
let hostname;
let image;
let socket;
let timerId;
let old={};

function sleepForever(){
    setTimeout(sleepForever,3600000);
}

function ckeckStatus(){

    //console.log(connected);
    let delta=60000;
    let akt=getStatus();
    if(old.image==akt.image && old.phase==akt.phase && old.progress==akt.progress){
	if(akt.phase=='finished' && akt.progress=='100'){
	    delta=3600000;
	    //if(getUsers()=="")halt();
	}
	//console.log('same');
    }else{
	let ans={
	    host: hostname,
	    image:image,
            update: akt
	}
	console.log(JSON.stringify(ans,null,2));
	if(true)socket.emit('update', ans);
    }
    old=akt;
    timerId=setTimeout(checkStatus,delta);
};

//let ans=lookupImageServer();
//if(ans!=''){
    connected=false;
    ho stname=getHostname();
    image=getImage();

//    socket=io('ws://'+ans+':3000');    
    socket = io("ws://localhost:3000");

    socket.on('connect', () => {console.log('connected'); connected=true });
    socket.on('disconnect', () => { console.log('disconnected');connected=false });

    setTimeout(checkStatus,1000);

//}else{
//    sleepForvever();
//}
