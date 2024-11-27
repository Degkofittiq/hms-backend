const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Création des répertoires si non existants
const uploadDir = path.join(__dirname, '../uploads');
const processedDir = path.join(uploadDir, 'processed');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(processedDir)) fs.mkdirSync(processedDir);

// Schéma utilisateur
const validTypes = [1, 2, 3, 4];

const userSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    name: {
        type: String,
        required: [true, 'Le champ nom est requis'],
        minlength: [3, 'Le nom doit contenir au moins 3 caractères'],
        maxlength: [200, 'Le nom est trop long'],
        trim: true,
    },
    username: {
        type: String,
        required: [true, 'Le champ nom d\'utilisateur est requis'],
        unique: true,
        trim: true,
    },
    picture: {
        type: String,
        validate: {
            validator: (value) => !value || /\.(jpg|jpeg|png|gif|svg)$/i.test(value), // Validation d'extension
            message: 'Le fichier doit avoir une extension valide (jpg, jpeg, png, gif, svg)!',
        },
        default: null,
    },
    type: {
        type: Number,
        required: [true, 'Vous devez choisir un type!'],
        validate: {
            validator: (value) => validTypes.includes(value),
            message: `Le type d'utilisateur doit être contenu dans cette liste: ${validTypes}`,
        },
    },
    password: {
        type: String,
        required: [true, 'Le champ mot de passe est requis'],
        validate: {
            validator: (value) =>
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value),
            message:
                'Le mot de passe doit contenir au moins 8 caractères, avec une majuscule, une minuscule, un chiffre, et un caractère spécial.',
        },
    },
}, {
    timestamps: true, // Ajoute les champs createdAt et updatedAt automatiquement
});

// Middleware pour hasher le mot de passe avant la sauvegarde
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Middleware pour traiter l'image avant la sauvegarde
userSchema.pre('save', async function (next) {
    if (this.isModified('picture') && this.picture) {
        const imagePath = this.picture;
        const extname = path.extname(imagePath).toLowerCase();
        
        // Vérifiez si l'extension est valide
        if (!/\.(jpg|jpeg|png|gif|svg)$/i.test(extname)) {
            return next(new Error('Le fichier doit avoir une extension valide (jpg, jpeg, png, gif, svg)!'));
        }

        // Chemin du fichier image original
        const filePath = path.join(uploadDir, imagePath);

        try {
            // Traitement de l'image avec sharp (redimensionnement, compression, etc.)
            await sharp(filePath)
                // .resize(800) // Redimensionner à 800px de largeur (vous pouvez ajuster selon vos besoins)
                .toFile(path.join(processedDir, imagePath)); // Sauvegarder l'image traitée

            // Si l'image est traitée, vous pouvez supprimer l'original si nécessaire
            fs.unlinkSync(filePath); // Supprimer l'image originale

            // Mettre à jour le chemin de l'image traitée
            this.picture = path.join('uploads', 'processed', imagePath);

        } catch (error) {
            return next(error); // Gestion des erreurs lors du traitement de l'image
        }
    }
    next();
});

const User = mongoose.model('users', userSchema);

module.exports = { User }; // Exporter le modèle User
