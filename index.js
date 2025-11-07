const admin = require('firebase-admin')
const serviceAccount = require('./splitmate-28cc2-firebase-adminsdk-9eniz-0114da411e.json'); // Cambia a la ruta de tu archivo JSON

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log('Firebase Admin inicializado.');
