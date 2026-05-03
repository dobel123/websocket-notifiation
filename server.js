const express = require("express");
const WebSocket = require("ws");

const app = express();
const PORT = 3000;

// Jalankan server HTTP
const server = app.listen(PORT, () => {
console.log(`Server jalan di http://localhost:${PORT}`);
});

// ==============================
// 🔹 WebSocket Server
// ==============================
const wss = new WebSocket.Server({ server });

let clients = [];
let history = []; // simpan semua notifikasi

wss.on("connection", (ws) => {
console.log("Client terhubung");

clients.push(ws);

// Hapus client jika disconnect
ws.on("close", () => {
console.log("Client terputus");
clients = clients.filter(client => client !== ws);
});
});

// ==============================
// 🔹 Endpoint HTTP
// ==============================

// Endpoint kirim notifikasi
app.get("/send", (req, res) => {
const message = "Notifikasi: " + new Date().toLocaleString();

// Simpan ke history
history.push(message);

// Kirim ke semua client (real-time)
clients.forEach(client => {
if (client.readyState === WebSocket.OPEN) {
client.send(message);
}
});

res.send("Notifikasi terkirim");
});

// Endpoint ambil data awal
app.get("/history", (req, res) => {
res.json(history);
});

// Endpoint root (optional biar tidak blank)
app.get("/", (req, res) => {
res.send("Server WebSocket aktif 🚀");
});