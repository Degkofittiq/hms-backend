const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const validTypes = [1, 2, 3, 4];

const userSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    name: {
        type: String,
        required: [true, 'The name field is required'],
        minlength: [3, 'The name field must contain at least 3 characters'],
        maxlength: [200, 'The name is too long'],
        trim: true,
    },
    username: {
        type: String,
        required: [true, 'The username field is required'],
        unique: true,
        trim: true,
    },
    picture: {
        type: String,
        validate: {
            validator: (value) => !value || /\.(jpg|jpeg|png|gif|svg)$/i.test(value), // Validation d'extension
            message: 'The file must have a valid image extension (jpg, jpeg, png, gif, svg)!',
        },
        default: null,
    },
    type: {
        type: Number,
        required: [true, 'You must choose one type!'],
        validate: {
            validator: (value) => validTypes.includes(value),
            message: `The user type must be contained in this list: ${validTypes}`,
        },
    },
    password: {
        type: String,
        required: [true, 'The password field is required'],
        validate: {
            validator: (value) =>
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value),
            message:
                'The password must contain at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a special character.',
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
            return next(new Error('The file must have a valid image extension (jpg, jpeg, png, gif, svg)!'));
        }

        // Chemin du fichier image original
        const filePath = path.join(__dirname, 'uploads', imagePath);

        try {
            // Traitement de l'image avec sharp (redimensionnement, compression, etc.)
            await sharp(filePath)
                .resize(800) // Redimensionner à 800px de largeur (vous pouvez ajuster selon vos besoins)
                .toFile(path.join(__dirname, 'uploads', 'processed', imagePath));

            // Si l'image est traitée, vous pouvez supprimer l'original si nécessaire
            fs.unlinkSync(filePath);

            // Mettre à jour le chemin de l'image traitée
            this.picture = path.join('uploads', 'processed', imagePath);

        } catch (error) {
            return next(error); // Gestion des erreurs lors du traitement de l'image
        }
    }
    next();
});

const User = mongoose.model('users', userSchema);

module.exports = User;
