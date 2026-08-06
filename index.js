const express = require('express');
const app = express();
let code = 'Generating... wait 10 sec';
let status = 'Starting bot...';

app.get('/', (req,res)=>{
 res.send(`<body style="background:#000;color:#fff;text-align:center;font-family:sans-serif;padding:20px">
 <h1 style="color:#00ff88">⚽ NOSA GOAL BOT ⚽</h1>
 <h2 style="background:#111;padding:25px;border-radius:15px;border:3px solid #00ff88">
 ${status}<br><br><span style="font-size:42px;letter-spacing:6px;color:#00ff88;font-weight:bold">${code}</span>
 </h2>
 <p style="font-size:18px">1. WhatsApp → Settings → Linked Devices</p>
 <p style="font-size:18px">2. Tap "Link a device"</p>
 <p style="font-size:18px">3. At bottom tap "Link with phone number instead"</p>
 <p style="font-size:18px">4. Type this 8-digit code</p>
 <p style="color:#888">Page auto-refresh every 20 sec</p>
 <script>setTimeout(()=>location.reload(),20000)</script>
 </body>`);
});

app.listen(process.env.PORT||10000, ()=>console.log('Web running'));

async function startBot(){
 const {default:makeWASocket,useMultiFileAuthState} = await require('@whiskeysockets/baileys');
 const P = require('pino');
 const {state,saveCreds}=await useMultiFileAuthState('auth');
 const sock=makeWASocket({auth:state,logger:P({level:'silent'})});
 sock.ev.on('creds.update',saveCreds);
 sock.ev.on('connection.update',(u)=>{
   if(u.connection==='open'){ status='✅ WHATSAPP CONNECTED! BOT LIVE!'; code='SUCCESS!'; }
 });
 setTimeout(async ()=>{
   try{
     const myNumber = "2349156112495";
     const pairingCode = await sock.requestPairingCode(myNumber);
     code = pairingCode;
     status = '✅ YOUR PAIRING CODE - ENTER IT NOW!';
     console.log('CODE:', pairingCode);
   }catch(e){ status='Error: '+e.message; console.log(e); }
 }, 6000);
}
startBot();
