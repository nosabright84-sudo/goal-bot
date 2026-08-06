const express = require('express');
const axios = require('axios');
const app = express();

let pairingCode = 'Loading... wait 8 sec';
let botStatus = '🚀 Starting...';
let sockGlobal = null;

app.get('/', (req,res)=>{
  res.send(`
  <body style="background:#000;color:#fff;text-align:center;font-family:Arial;padding:15px">
    <h1 style="color:#00ff88;margin-top:30px">⚽ NOSA GOAL BOT</h1>
    <div style="background:#111;padding:25px;border-radius:20px;border:3px solid #00ff88;max-width:380px;margin:20px auto">
      <p style="color:#aaa;font-size:14px">${botStatus}</p>
      <h1 style="font-size:44px;letter-spacing:8px;color:#00ff88;margin:15px 0;font-weight:bold">${pairingCode}</h1>
      <p style="color:#ffff00;font-size:13px">⚠️ Code expires in 25 sec - Enter FAST!</p>
    </div>
    <p style="text-align:left;max-width:380px;margin:10px auto">1. WhatsApp → Settings → Linked Devices</p>
    <p style="text-align:left;max-width:380px;margin:10px auto">2. Tap <b>Link a device</b></p>
    <p style="text-align:left;max-width:380px;margin:10px auto">3. Tap <b>Link with phone number instead</b> (bottom)</p>
    <p style="text-align:left;max-width:380px;margin:10px auto">4. Type the 8 characters above</p>
    <p style="color:#666;margin-top:30px;font-size:12px">Auto-generates new code every 35 sec - refresh if needed</p>
    <script>setTimeout(()=>location.reload(),30000)</script>
  </body>`);
});

app.listen(process.env.PORT||10000, ()=>console.log('Web live'));

async function startBot(){
  const {default:makeWASocket,useMultiFileAuthState} = await require('@whiskeysockets/baileys');
  const P = require('pino');
  const {state,saveCreds}=await useMultiFileAuthState('auth_info_baileys');
  
  const sock = makeWASocket({
    auth: state,
    logger: P({level:'silent'}),
    browser: ["Ubuntu","Chrome","110.0.0.0"],
    syncFullHistory: false
  });
  
  sockGlobal = sock;
  sock.ev.on('creds.update', saveCreds);
  
  sock.ev.on('connection.update', (u)=>{
    if(u.connection==='open'){
      botStatus='✅ WHATSAPP LINKED! Bot is LIVE monitoring goals!';
      pairingCode='✅ CONNECTED';
      console.log('CONNECTED SUCCESS');
      startMonitor();
    }
    if(u.connection==='close'){
      botStatus='Connection closed - generating new code...';
      setTimeout(()=>{ startBot(); }, 3000);
    }
  });

  const genCode = async ()=>{
    try{
      botStatus='Generating fresh code...';
      const code = await sock.requestPairingCode("2349156112495");
      pairingCode = code;
      botStatus='✅ FRESH CODE READY! ENTER NOW! (15 sec left)';
      console.log('CODE:', code);
    }catch(e){
      console.log('Gen error', e.message);
      botStatus='Retrying code in 3 sec...';
      setTimeout(genCode, 3000);
    }
  };

  setTimeout(genCode, 4000);
  setInterval(genCode, 35000);
}

function startMonitor(){
  console.log('Goal monitor started');
  setInterval(async ()=>{
    try{
      console.log('Checking live games...', new Date().toLocaleTimeString());
      // Real API will be added after you link
    }catch(e){}
  }, 30000);
}

startBot();
