const express = require("express");
const path = require("path");
const webpush = require("web-push");
const cors = require("cors");

const app = express();

// 1. CORS Middleware ganz oben, vor allem anderen
app.use(cors({
  origin: "https://klassisches-reaktionsspiel.netlify.app",
  methods: ["GET", "POST", "OPTIONS"],   // Wichtig: OPTIONS erlauben
}));
app.options('*', cors());


// 2. Express JSON parser
app.use(express.json());

// 3. Statische Dateien
app.use(express.static(path.join(__dirname, "frontend")));

webpush.setVapidDetails(
  "mailto:louisz1@gmx.de",
  "BOxnFFyTXl1SPNdGicE-mr66IbGzWhylvOHA-xuxP4VaKdC-f12SS_N25YqUtfKY2N_nxxCyYUtdhRvNdfIwwls",
  "Xo2xy8LdSxojr4c15AycmunBaWUHRhPV88eGNo2M7aw"
);

const messages = [
  "Zeit für eine neue Reaktion! 🚀",
  "Bist du schneller geworden? ⏱️",
  "Mach eine Pause... oder reagiere schneller! 😄",
  "Push dich selbst! 🔔",
  "Versuch Nr. 42? Vielleicht klappt’s! 💪",
  "Wach bleiben! Noch einmal tippen! ☕",
  "Du bist dran! 🔥",
  "Schon 1 Stunde vorbei... Teste dich nochmal! ⌛",
  "Dein Reaktionsspiel wartet. 👀",
  "Bereit für deinen nächsten Highscore? 🏆"
];

function getRandomMessage() {
  return messages[Math.floor(Math.random() * messages.length)];
}

// Push-Handler
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
