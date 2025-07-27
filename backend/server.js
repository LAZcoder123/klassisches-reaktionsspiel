const express = require("express");
const path = require("path");
const webpush = require("web-push");

const app = express();
app.use(express.static(path.join(__dirname, "frontend")));
app.use(express.json());

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
  const index = Math.floor(Math.random() * messages.length);
  return messages[index];
}

// 📨 Push-Handler
app.post("/subscribe", (req, res) => {
  const subscription = req.body;

  // ✅ Sofortige Nachricht beim ersten Laden
  const payload = JSON.stringify({
    title: "Willkommen zurück!",
    body: getRandomMessage(),
  });

  webpush
    .sendNotification(subscription, payload)
    .catch(err => console.error("Fehler bei Sofortnachricht:", err));

  // ⏱ Nachricht nach 1 Stunde (3600000 ms)
  setTimeout(() => {
    const delayedPayload = JSON.stringify({
      title: "Hey, Lust auf eine neue Runde?",
      body: getRandomMessage(),
    });

    webpush
      .sendNotification(subscription, delayedPayload)
      .catch(err => console.error("Fehler bei späterer Nachricht:", err));
  }, 3600000); // 1 Stunde

  res.status(201).json({ message: "Benachrichtigungen geplant." });
});

app.listen(3000, () => {
  console.log("✅ Server läuft auf http://localhost:3000");
});
