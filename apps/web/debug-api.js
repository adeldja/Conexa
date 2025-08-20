// Script de débogage pour tester la connectivité API
const axios = require('axios');

async function testAPIConnection() {
  console.log('🔍 Test de connectivité API...');
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  console.log(`📍 URL de base: ${apiUrl}`);
  
  try {
    // Test 1: Connexion basique
    console.log('\n1️⃣ Test de connexion basique...');
    const response1 = await axios.get(`${apiUrl}/specialties`, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    console.log('✅ Connexion réussie!');
    console.log(`📊 Spécialités trouvées: ${response1.data.length}`);
    
    // Test 2: Test avec la même configuration que le frontend
    console.log('\n2️⃣ Test avec configuration Axios identique...');
    const apiInstance = axios.create({
      baseURL: apiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const response2 = await apiInstance.get('/specialties');
    console.log('✅ Test avec instance Axios réussi!');
    console.log(`📊 Données: ${JSON.stringify(response2.data.slice(0, 1), null, 2)}`);
    
  } catch (error) {
    console.error('❌ Erreur détectée:');
    console.error(`Code: ${error.code}`);
    console.error(`Message: ${error.message}`);
    
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Headers: ${JSON.stringify(error.response.headers, null, 2)}`);
    }
    
    if (error.request) {
      console.error('Requête:', error.request);
    }
  }
}

testAPIConnection();
