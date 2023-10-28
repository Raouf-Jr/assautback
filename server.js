
/*const db = mysql.createConnection({
  host: '7055-154-66-165-227.ngrok-free.app', // L'hôte de votre base de données
  user: 'Jr', // Le nom d'utilisateur que vous avez créé
  password: '123456', // Le mot de passe de l'utilisateur
  database: 'repasDB', // Le nom de votre base de données
});*/

const express = require('express');
const mysql = require('mysql');

const app = express();

const db = mysql.createConnection({
  host: '91b7-197-239-80-178.ngrok-free.app', // Assurez-vous que cette valeur correspond à l'emplacement de votre base de données
  user: 'Jr', // Le nom d'utilisateur que vous avez créé
  password: '123456', // Le mot de passe de l'utilisateur
  database: 'repasDB', // Le nom de votre base de données
});

// Connexion à la base de données
db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
    return;
  }
  console.log('Connecté à la base de données MySQL.');
});

// Endpoint pour obtenir des données depuis la table "repas"
// Endpoint pour obtenir le nombre de repas par nom
app.get('/get-repas-count/:nom', (req, res) => {
    const nom = req.params.nom;
    const query = 'SELECT nombre_de_repas FROM repas WHERE nom = ?';
    db.query(query, [nom], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur de base de données' });
        return;
      }
      if (results.length > 0) {
        res.json({ repasCount: results[0].nombre_de_repas });
      } else {
        res.json({ repasCount: 0 });
      }
    });
  });
  
app.post('/add-repas', (req, res) => {
    const { name } = req.body;
  
    // Rechercher un enregistrement avec le même nom de repas
    const query = 'SELECT * FROM repas WHERE nom = ?';
    db.query(query, [name], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur de base de données' });
        return;
      }
  
      if (results.length > 0) {
        // Un enregistrement existe déjà pour ce nom de repas, mettons à jour le nombre de repas
        const updateQuery = 'UPDATE repas SET nombre_de_repas = nombre_de_repas + 1 WHERE nom = ?';
        db.query(updateQuery, [name], (updateErr, updateResults) => {
          if (updateErr) {
            console.error(updateErr);
            res.status(500).json({ error: 'Erreur de base de données' });
            return;
          }
  
          // Récupérer le nombre de repas mis à jour
          const getUpdatedCountQuery = 'SELECT nombre_de_repas FROM repas WHERE nom = ?';
          db.query(getUpdatedCountQuery, [name], (getCountErr, getCountResults) => {
            if (getCountErr) {
              console.error(getCountErr);
              res.status(500).json({ error: 'Erreur de base de données' });
              return;
            }
            const repasCount = getCountResults[0].nombre_de_repas;
  
            res.json({ success: true, repasCount });
          });
        });
      } else {
        // Aucun enregistrement trouvé, créons un nouvel enregistrement
        const insertQuery = 'INSERT INTO repas (nom, nombre_de_repas) VALUES (?, 1)';
        db.query(insertQuery, [name], (insertErr, insertResults) => {
          if (insertErr) {
            console.error(insertErr);
            res.status(500).json({ error: 'Erreur de base de données' });
            return;
          }
          res.json({ success: true, repasCount: 1 });
        });
      }
    });
  });
  const port = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log('Serveur backend en cours d\'exécution sur le port 3000');
});
