const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { User }  = require('../models/user')

// Fonction pour initialiser la base de données
const initDB = async () => {
    try {
        // Connexion à MongoDB
        await mongoose.connect('mongodb://localhost:27017/hms_backend', {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log('Connexion à MongoDB réussie !');

        // Réinitialiser la collection User (optionnel)
        await User.deleteMany({}); // Supprime tous les utilisateurs existants

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ username: 'AdminHMS' });
        if (existingUser) {
            console.log('L\'utilisateur existe déjà avec ce username');
        } else {
            // Création d'un utilisateur par défaut
            // const hashedPassword = await bcrypt.hash('AdmEvt@123', 10);
            const user = new User({
                username: 'AdminHMS',
                name: 'Degkof',
                email: 'degkofittiq@gmail.com',
                // picture: "yoamn.png",
                type: 4,
                password: 'AdmEvt@123'
            });
            await user.save();

            console.log('Utilisateur créé :', user.toJSON());
        }

        console.log('La BDD a bien été initialisée !');
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de la base de données :', error);
    }
};

module.exports = {
    initDB,
    User,
};
