const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const express = require('express')
const QRCode = require('qrcode')
const P = require('pino')
let qrCode = ''
const app = express()
app.get('/', async (req, res) => {
  if (!qrCode) return res.send(`<h1>Wait 10 sec.. Refresh!</h1><script>setTimeout(()=>location.reload(),3000)</script>`)
  const img = await QRCode.toDataURL(qrCode)
  res.send(`<center><h1 style=color:#00ff88>⚽ NOSA GOAL BOT LIVE ⚽</h1><img src="${img}" width="300"><h2>Scan with WhatsApp</h2></center>`)
})
app.listen(process.env.PORT || 10000, ()=>console.log('Live'))
async function startBot(){
  const {state,saveCreds}=await useMultiFileAuthState('auth')
  const sock=makeWASocket({auth:state,logger:P({level:'silent'})})
  sock.ev.on('creds.update',saveCreds)
  sock.ev.on('connection.update',u=>{if(u.qr)qrCode=u.qr; if(u.connection==='open')console.log('Connected!')})
}
startBot()
