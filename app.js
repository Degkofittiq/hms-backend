const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const { initDB } = require('./src/db/mongodb');
const cors =  require('cors')

// initDB();

const app = express();
const port = 3000;

initDB()

// Configuration du moteur de vue
app.set('view engine', 'ejs')
   .set('views', path.join(__dirname, 'views')) // Chemin vers le dossier views
   .use(expressLayouts)
   .set('layout', 'layouts/layout') // Utilise layouts/layout.ejs comme modèle de base

// Configuration des middlewares
app.use(favicon(path.join(__dirname, 'favicon.ico')))
   .use(morgan('dev'))
   // Support des formulaires encodés en URL
   .use(bodyParser.json())
   .use(bodyParser.urlencoded({ extended: true }))
   .use(cors())
   .use('/admin-assets', express.static(path.join(__dirname, 'public', 'startbootstrap-sb-admin-2')))
   .use(express.static(path.join(__dirname, 'public')))
   .use(express.json())
   .use(express.urlencoded({ extended: true }))

 

// Définition des routes
app.get('/', (req, res) => res.render('index', { title: 'Accueil' })) // Rendu avec index.ejs
   .get('/admin', (req, res) => res.render('admin', { title: 'Dashboard' })) // Rendu avec admin.ejs
   .get('/user', (req, res) => res.render('index', { title: 'Dashboard Users' })) // Rendu avec admin.ejs
   .get('/404', (req, res) => res.render('404', { 
       title: 'Error Users',
       errorCode: '404',
       errorMessage: 'Page Not Found',
       additionalMessage: 'It looks like you found a glitch in the matrix...'
   }))
   .get('/500', (req, res) => res.render('500', {
       title: 'Error Users',
       errorCode: '500',
       errorMessage: 'Internal Server Error',
       additionalMessage: 'It looks like something is wrong with the traitement...'
   }))


// Routes Dynamiques
app.get('/teteyooo', (req, res) => {
    res.json('Hello Express AYOMAN 😊')
})

// EndPoints
require('./src/routes/auth/login')(app)
require('./src/routes/auth/register')(app)


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
