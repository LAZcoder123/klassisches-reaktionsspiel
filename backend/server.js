const express = require("express");
const path = require("path");
const webpush = require("web-push");
const cors = require("cors");

const app = express();

// 1. CORS Middleware ganz oben, vor allen Routen
app.use(cors({
  origin: "https://klassisches-reaktionsspiel.netlify.app",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// 2. OPTIONS-Preflight für alle Pfade erlauben
app.options("*", cors());

// 3. Express JSON parser
app.use(express.json());

// 4. Statische Dateien (optional, falls du Frontend hier bedienst)
app.use(express.static(path.join(__dirname, "frontend")));

webpush.setVapidDetails(
  "mailto:louisz1@gmx.de",
  "BOxnFFyTXl1SPNdGicE-mr66IbGzWhylvOHA-xuxP4VaKdC-f12SS_N25YqUtfKY2N_nxxCyYUtdhRvNdfIwwls",
  "Xo2xy8LdSxojr4c15AycmunBaWUHRhPV88eGNo2M7aw"
);

const messages = [
  // ... deine Nachrichten ...
];

function getRandomMessage() {
  return messages[Math.floor(Math.random() * messages.length)];
}

app.post("/subscribe", (req, res) => {
  const subscription = req.body;

  const payload = JSON.stringify({
    title: "Willkommen zurück!",
    body: getRandomMessage(),
  });

  webpush.sendNotification(subscription, payload).catch(err => {
    console.error("Fehler bei Sofortnachricht:", err);
  });

  setTimeout(() => {
    const delayedPayload = JSON.stringify({
      title: "Hey, Lust auf eine neue Runde?",
      body: getRandomMessage(),
    });

    webpush.sendNotification(subscription, delayedPayload).catch(err => {
      console.error("Fehler bei späterer Nachricht:", err);
    });
  }, 3600000);

  res.status(201).json({ message: "Benachrichtigungen geplant." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server läuft auf Port ${PORT}`);
});
