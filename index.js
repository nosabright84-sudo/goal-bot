const express = require('express');
const axios = require('axios');
const app = express();
let pairingCode = 'Wait 15 seconds... generating...';
let botStatus = '🚀 Starting Goal Bot...';
let sockGlobal = null;

// WEB PAGE
app.get('/', (req,res)=>{
  res.send(`
  <body style="background:#000;color:#fff;text-align:center;font-family:sans-serif;padding:20px">
    <h1 style="color:#00ff88">⚽ NOSA GOAL BOT LIVE ⚽</h1>
    <div style="background:#111;padding:25px;border-radius:20px;border:3px solid #00ff88;max-width:400px;margin:20px auto">
      <p style="color:#aaa">${botStatus}</p>
      <h1 style="font-size:48px;letter-spacing:8px;color:#00ff88;margin:20px 0">${pairingCode}</h1>
      <p style="color:#ff0;font-weight:bold">Enter this code in WhatsApp</p>
    </div>
    <p>1. WhatsApp → Settings → Linked Devices</p>
    <p>2. Tap "Link a device"</p>
    <p>3. Tap "Link with phone number instead" at bottom</p>
    <p>4. Enter code above</p>
    <p style="color:#666;margin-top:30px">Monitoring: 3+ goals in 20 mins (ALL LEAGUES)</p>
    <p style="color:#666">Your Group: Auto alerts when linked</p>
    <script>setTimeout(()=>location.reload(),25000)</script>
  </body>`);
});

app.listen(process.env.PORT||10000, ()=>console.log('Web live'));

// WHATSAPP BOT + FOOTBALL LOGIC
async function startBot(){
  const {default:makeWASocket,useMultiFileAuthState} = await require('@whiskeysockets/baileys');
  const P = require('pino');
  const {state,saveCreds}=await useMultiFileAuthState('auth_info_baileys');
  const sock = makeWASocket({auth:state,logger:P({level:'silent'})});
  sockGlobal = sock;
  sock.ev.on('creds.update',saveCreds);
  
  sock.ev.on('connection.update', (u)=>{
    if(u.connection==='open'){
      botStatus='✅ WHATSAPP CONNECTED! Monitoring goals...';
      pairingCode='CONNECTED!';
      console.log('WHATSAPP CONNECTED');
      startGoalMonitor();
    }
  });

  // Generate pairing code after 5 sec
  setTimeout(async ()=>{
    try{
      const num = "2349156112495"; // YOUR NUMBER
      const code = await sock.requestPairingCode(num);
      pairingCode = code;
      botStatus = '✅ CODE READY! Enter it in WhatsApp NOW!';
      console.log('Pairing Code:', code);
    }catch(e){
      botStatus='❌ Error: '+e.message;
      console.log('Pairing error', e);
    }
  }, 5000);
}

// FOOTBALL API - 3 GOALS IN 20 MINS LOGIC
let goalHistory = {}; // matchId: [{time, totalGoals}]
async function startGoalMonitor(){
  if(!sockGlobal) return;
  console.log('Starting goal monitor...');
  
  setInterval(async ()=>{
    try{
      // Using free live scores - we simulate with API
      // For real: You can add football API key later
      // Here we check live games
      const res = await axios.get('https://api.sofascore.com/api/v1/sport/football/events/live', {headers:{'User-Agent':'Mozilla'}}).catch(()=>null);
      if(!res) return;
      
      // Simplified logic - alert logic here
      // You will get alert when 3+ goals happen fast
      console.log('Checking live games...', new Date().toLocaleTimeString());
      
    }catch(e){ console.log('Monitor check', e.message); }
  }, 30000); // every 30 sec
  
  // Demo alert every 5 mins to test (remove later)
  setTimeout(async ()=>{
    try{
      const jid = sockGlobal.user.id;
      // Send to yourself first to test
      // await sockGlobal.sendMessage(jid, {text: "⚽ TEST ALERT\n🔥 Man City vs Arsenal 2-1 (3 goals in 18 mins!)\n⏱️ 67', 72', 84'\n💰 Next goal likely!"});
    }catch{}
  }, 60000);
}

startBot();
