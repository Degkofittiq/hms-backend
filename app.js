const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');

const app = express();
const port = 3000;

// Configuration du moteur de vue
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Chemin vers le dossier views

// Configuration des layouts EJS
app.use(expressLayouts);
app.set('layout', 'layouts/layout'); // Utilise layouts/layout.ejs comme modèle de base

// Middleware pour le favicon
app.use(favicon(path.join(__dirname, 'favicon.ico')));

// Middleware pour journaliser les requêtes
app.use(morgan('dev'));

// Middleware pour analyser les corps de requêtes JSON
app.use(bodyParser.json());

// Servir les fichiers statiques
app.use('/admin-assets', express.static(path.join(__dirname, 'public', 'startbootstrap-sb-admin-2')));
app.use(express.static(path.join(__dirname, 'public')));

// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.render('index', { title: 'Accueil' }); // Rendu avec index.ejs
});

// Route pour la page d'administration
app.get('/admin', (req, res) => {
    res.render('admin', { title: 'Dashbord' }); // Rendu avec admin.ejs
});

// Route pour la page des users
app.get('/user', (req, res) => {
    res.render('index', { title: 'Dashbord Users' }); // Rendu avec admin.ejs
});

// Route pour la page des erreurs
app.get('/404', (req, res) => {
    // res.render('404', { title: 'Error Users' }); // Rendu avec admin.ejs
    // Vous pouvez passer plus de données ici
    res.render('404', { 
        title: 'Error Users',
        errorCode: '404',
        errorMessage: 'Page Not Found',
        additionalMessage: 'It looks like you found a glitch in the matrix...'
    });
});


// Route pour la page des users
app.get('/500', (req, res) => {
    // res.render('500', { title: 'Error Users' }); // Rendu avec admin.ejs
    // Vous pouvez passer plus de données ici
    res.render('500', { 
        title: 'Error Users',
        errorCode: '500',
        errorMessage: 'Internal Server Error',
        additionalMessage: 'It looks like something is wrong with the traitement...'
    });
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).render('layouts/layout', {
        title: 'Erreur 404',
        content: 'Page non trouvée.'
    });
});

// Lancer le serveur
app.listen(port, () => {
    console.log(`Eventinz App est en cours d'exécution sur http://localhost:${port}`);
});
