const express = require('express');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const sequelize = require('./src/db/sequelize');
const morgan = require('morgan');
const path = require('path');

const app = express();
const port = 3000;

// Middleware de journalisation
app.use(morgan('dev'));

// Middleware pour servir le favicon
app.use(favicon(path.join(__dirname, 'favicon.ico')));

// Middleware pour analyser les corps de requêtes JSON
app.use(bodyParser.json());

// Servir les fichiers statiques de SB Admin 2 depuis node_modules
app.use('/admin-assets', express.static(path.join(__dirname, 'node_modules/startbootstrap-sb-admin-2')));

// Servir les fichiers statiques du dossier public (CSS, images, JS personnalisés)
app.use(express.static(path.join(__dirname, 'public')));

// Route pour la page d'accueil (Hello Eventinz Users)
app.get('/', (req, res) => {
    res.send('Hello Eventinz Users 😊🙌');
});

// Point d'entrée pour la page d'accueil du back-office
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'startbootstrap-sb-admin-2/index.html'));
});

// Initialisation de la base de données avec Sequelize
sequelize.initDB();

// Gestion des erreurs 404 - Si aucune route n'est trouvée
app.use((req, res) => {
    res.status(404).send('Resource not found. Please check your URL.');
});

// Lancer le serveur
app.listen(port, () => {
    console.log(`Eventinz App is running at http://localhost:${port}`);
});
