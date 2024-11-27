const { User } = require('../../db/mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const privateKey = require('../../auth/private_key');

module.exports = (app) => {
  app.post('/api/register', async (req, res) => {
    try {
      const { name, email, username, picture, type, password } = req.body;
      console.log(req.body)

      // Vérifier que tous les champs obligatoires sont présents
      if (!name || !email || !username || !type || !password) {
        return res.status(400).json({ message: "Tous les champs obligatoires doivent être fournis." });
      }

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "Un utilisateur avec ce email existe déjà." });
      }
      const existingUserUname = await User.findOne({ username });
      if (existingUserUname) {
        return res.status(409).json({ message: "Un utilisateur avec ce nom d'utilisateur existe déjà." });
      }

      // Créer un nouvel utilisateur
      const newUser = new User({
        name,
        email,
        username,
        picture,
        type,
        password, // Le mot de passe sera automatiquement haché grâce au middleware dans le modèle
      });

      // Enregistrer l'utilisateur dans la base de données
      await newUser.save();

      // Générer un token JWT pour l'utilisateur enregistré
      const token = jwt.sign(
        { userId: newUser._id },
        privateKey,
        { expiresIn: '24h' }
      );

      // Retourner une réponse réussie
      const { password: _, ...userWithoutPassword } = newUser._doc; // Exclure le mot de passe de la réponse
      return res.status(201).json({
        message: "L'utilisateur a été créé avec succès.",
        data: userWithoutPassword,
        token,
      });
    } catch (error) {
      console.error(error);
      const message = "Une erreur est survenue lors de l'inscription.";
    //   return res.status(500).json({ message, data: error.errmsg });
      return res.status(500).json({ message, data: error });
    }
  });
};
