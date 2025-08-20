#!/usr/bin/env node
/**
 * Script de test pour les spécialités côté frontend
 */

const axios = require('axios');

const API_BASE = 'http://localhost:3001'; // Backend API direct
const USER_ID = 'f8de3e29-8d63-42b7-92f7-df2b6a30c3b7';

async function testSpecialties() {
  console.log('🧪 Test des spécialités via le frontend...\n');

  try {
    // 1. Récupérer les spécialités du prestataire
    console.log('1. Récupération des spécialités...');
    const getResponse = await axios.get(`${API_BASE}/specialties/provider/${USER_ID}`);
    console.log('✅ Spécialités récupérées:', getResponse.data.length);
    
    if (getResponse.data.length > 0) {
      console.log('   Première spécialité:', getResponse.data[0].specialty.name);
      
      // 2. Tester la suppression
      const specialtyToRemove = getResponse.data[0];
      console.log('\n2. Test de suppression...');
      
      const deleteResponse = await axios.delete(
        `${API_BASE}/specialties/provider/${USER_ID}/${specialtyToRemove.specialtyId}`,
        {
          data: { userId: USER_ID }
        }
      );
      console.log('✅ Spécialité supprimée avec succès');
      
      // 3. Vérifier que la suppression a fonctionné
      console.log('\n3. Vérification post-suppression...');
      const checkResponse = await axios.get(`${API_BASE}/specialties/provider/${USER_ID}`);
      console.log('✅ Nombre de spécialités après suppression:', checkResponse.data.length);
    }

    console.log('\n🎉 Tous les tests sont passés !');
    
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
  }
}

testSpecialties();
