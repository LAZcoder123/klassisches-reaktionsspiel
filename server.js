const express = require("express");
const path = require("path");
const webpush = require("web-push");

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// ✳️ VAPID-Keys einfügen
webpush.setVapidDetails(
  "mailto:louisz1@gmx.de",
  "BOxnFFyTXl1SPNdGicE-mr66IbGzWhylvOHA-xuxP4VaKdC-f12SS_N25YqUtfKY2N_nxxCyYUtdhRvNdfIwwls",
  "Xo2xy8LdSxojr4c15AycmunBaWUHRhPV88eGNo2M7aw"
);

// ✳️ Push-Endpunkt
app.post("/subscribe", (req, res) => {
  const subscription = req.body;

  // Sofortige Testnachricht senden
  const payload = JSON.stringify({
    title: "Test-Benachrichtigung",
    body: "Push funktioniert! 🎉",
  });

  webpush
    .sendNotification(subscription, payload)
    .then(() => res.status(201).json({}))
    .catch(err => {
      console.error("Fehler beim Senden:", err);
      res.sendStatus(500);
    });
});

app.listen(3000, () => {
  console.log("Server läuft auf http://localhost:3000");
});
