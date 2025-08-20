'use client';

import { useState, useEffect } from 'react';
import { api } from '@/apiConfig';

export function useDebugSpecialties() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        console.log('🚀 Début du chargement des spécialités...');
        console.log('📍 Base URL:', api.defaults.baseURL);
        
        setLoading(true);
        setError(null);
        
        const response = await api.get('/specialties');
        console.log('✅ Réponse reçue:', response.data);
        
        setData(response.data);
      } catch (err) {
        console.error('❌ Erreur API:', err);
        console.error('Code d\'erreur:', err.code);
        console.error('Message:', err.message);
        console.error('Stack:', err.stack);
        
        if (err.response) {
          console.error('Response status:', err.response.status);
          console.error('Response data:', err.response.data);
        }
        
        if (err.request) {
          console.error('Request config:', err.config);
        }
        
        setError(err);
      } finally {
        setLoading(false);
        console.log('🏁 Fin du chargement des spécialités');
      }
    };

    loadSpecialties();
  }, []);

  return { data, error, loading };
}
