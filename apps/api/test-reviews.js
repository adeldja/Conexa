// Script de test pour les APIs de reviews
const axios = require('axios');

const API_BASE = 'http://localhost:3001';

// Helper pour créer des utilisateurs et des reviews de test
async function testReviewsAPI() {
  try {
    console.log('🧪 Test des APIs de reviews...\n');

    // 1. Récupérer tous les reviews existants
    console.log('📋 Récupération de tous les reviews...');
    try {
      const allReviews = await axios.get(`${API_BASE}/reviews`);
      console.log(`Nombre de reviews existants: ${allReviews.data.length}`);

      if (allReviews.data.length > 0) {
        console.log(
          'Premier review:',
          JSON.stringify(allReviews.data[0], null, 2),
        );
      }
    } catch (error) {
      console.log(
        'Erreur lors de la récupération des reviews:',
        error.response?.data || error.message,
      );
    }

    // 2. Récupérer tous les users pour identifier des providers et clients
    console.log('\n👥 Récupération des utilisateurs...');
    try {
      const users = await axios.get(`${API_BASE}/users`);
      console.log(`Nombre d'utilisateurs: ${users.data.length}`);

      const providers = users.data.filter((u) => u.role === 'PROVIDER');
      const clients = users.data.filter((u) => u.role === 'CLIENT');

      console.log(`Providers: ${providers.length}, Clients: ${clients.length}`);

      if (providers.length > 0 && clients.length > 0) {
        const providerId = providers[0].id;
        const clientId = clients[0].id;

        console.log(`Provider ID: ${providerId}, Client ID: ${clientId}`);

        // 3. Créer un review de test
        console.log("\n📝 Création d'un review de test...");
        try {
          const newReview = await axios.post(`${API_BASE}/reviews`, {
            rating: 5,
            comment: "Excellent service ! Très professionnel et à l'écoute.",
            providerId: providerId,
            clientId: clientId,
          });
          console.log('Review créé:', JSON.stringify(newReview.data, null, 2));

          // 4. Récupérer les reviews du provider
          console.log(
            `\n📊 Récupération des reviews du provider ${providerId}...`,
          );
          const providerReviews = await axios.get(
            `${API_BASE}/reviews/provider/${providerId}`,
          );
          console.log(
            'Reviews du provider:',
            JSON.stringify(providerReviews.data, null, 2),
          );

          // 5. Récupérer les stats du provider
          console.log(
            `\n📈 Récupération des stats du provider ${providerId}...`,
          );
          const providerStats = await axios.get(
            `${API_BASE}/reviews/provider/${providerId}/stats`,
          );
          console.log(
            'Stats du provider:',
            JSON.stringify(providerStats.data, null, 2),
          );
        } catch (error) {
          console.log(
            'Erreur lors de la création du review:',
            error.response?.data || error.message,
          );
        }
      }
    } catch (error) {
      console.log(
        'Erreur lors de la récupération des utilisateurs:',
        error.response?.data || error.message,
      );
    }
  } catch (error) {
    console.error('Erreur générale:', error.message);
  }
}

// Fonction pour créer plusieurs reviews de test
async function createTestReviews() {
  try {
    console.log('🎭 Création de reviews de test...\n');

    // Récupérer les utilisateurs
    const users = await axios.get(`${API_BASE}/users`);
    const providers = users.data.filter((u) => u.role === 'PROVIDER');
    const clients = users.data.filter((u) => u.role === 'CLIENT');

    if (providers.length === 0 || clients.length === 0) {
      console.log("Pas assez d'utilisateurs pour créer des reviews de test");
      return;
    }

    const providerId = providers[0].id;

    // Reviews de test avec différentes notes et commentaires
    const testReviews = [
      {
        rating: 5,
        comment:
          'Service exceptionnel ! Je recommande vivement. Très professionnel et ponctuel.',
        providerId,
        clientId: clients[0]?.id,
      },
      {
        rating: 4,
        comment:
          "Très bon travail, quelques petits détails à améliorer mais dans l'ensemble très satisfait.",
        providerId,
        clientId: clients[1]?.id || clients[0]?.id,
      },
      {
        rating: 5,
        comment:
          "Parfait ! Exactement ce que je cherchais. Prestataire à l'écoute et compétent.",
        providerId,
        clientId: clients[0]?.id,
      },
      {
        rating: 3,
        comment:
          'Correct, sans plus. Le travail a été fait mais manquait un peu de créativité.',
        providerId,
        clientId: clients[1]?.id || clients[0]?.id,
      },
      {
        rating: 5,
        comment:
          'Fantastique ! Dépassé mes attentes. Communication excellente tout au long du projet.',
        providerId,
        clientId: clients[0]?.id,
      },
    ];

    for (const review of testReviews) {
      if (review.clientId) {
        try {
          const created = await axios.post(`${API_BASE}/reviews`, review);
          console.log(
            `✅ Review créé: ${review.rating}⭐ - "${review.comment.substring(0, 50)}..."`,
          );
        } catch (error) {
          console.log(
            `❌ Erreur pour le review: ${error.response?.data?.message || error.message}`,
          );
        }
      }
    }

    console.log('\n📊 Récupération des stats finales...');
    const finalStats = await axios.get(
      `${API_BASE}/reviews/provider/${providerId}/stats`,
    );
    console.log('Stats finales:', JSON.stringify(finalStats.data, null, 2));
  } catch (error) {
    console.error(
      'Erreur lors de la création des reviews de test:',
      error.message,
    );
  }
}

// Exécution
if (process.argv[2] === 'create') {
  createTestReviews();
} else {
  testReviewsAPI();
}
