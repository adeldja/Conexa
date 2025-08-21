import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui';
import { specialtyService } from '@/services';
import { generateTempSpecialtyId } from '@/utils/id';
import type { Specialty, ProviderSpecialty } from '@/types/profiles';

export function useSpecialties() {
  const { user } = useAuth();
  const { success, error } = useToast();

  // États
  const [allSpecialties, setAllSpecialties] = useState<Specialty[]>([]);
  const [mySpecialties, setMySpecialties] = useState<ProviderSpecialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  // Charger les données
  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);

        // Charger toutes les spécialités et celles du provider en parallèle
        const [specialtiesResponse, mySpecialtiesResponse] = await Promise.all([
          specialtyService.getAll(),
          specialtyService.getProviderSpecialties(user.id),
        ]);

        setAllSpecialties(specialtiesResponse);

        // Déduplication des spécialités du provider (au cas où)
        const uniqueMySpecialties = mySpecialtiesResponse.filter(
          (specialty, index, arr) => arr.findIndex(s => s.id === specialty.id) === index
        );

        setMySpecialties(uniqueMySpecialties);
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        error('Erreur de chargement', 'Impossible de charger les spécialités');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id]); // Suppression de 'error' des dépendances

  // Filtrer les spécialités disponibles (non encore ajoutées)
  const availableSpecialties = allSpecialties.filter(
    specialty =>
      !mySpecialties.some(ms => ms.specialtyId === specialty.id) &&
      (searchQuery === '' ||
        specialty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (specialty.description &&
          specialty.description.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  // Ajouter une spécialité
  const handleAddSpecialty = async (specialty: Specialty) => {
    if (!user?.id) return;

    setProcessingIds(prev => new Set(prev).add(specialty.id));

    try {
      // Optimistic update
      const newProviderSpecialty: ProviderSpecialty = {
        id: generateTempSpecialtyId(),
        providerId: user.id,
        specialtyId: specialty.id,
        level: 'Intermédiaire',
        createdAt: new Date().toISOString(),
        specialty,
      };

      setMySpecialties(prev => [...prev, newProviderSpecialty]);

      // Appel API
      const response = await specialtyService.addToProvider(user.id, {
        specialtyId: specialty.id,
        level: 'Intermédiaire',
      });

      // Mettre à jour avec la réponse du serveur
      setMySpecialties(prev => prev.map(ms => (ms.id === newProviderSpecialty.id ? response : ms)));

      success('Spécialité ajoutée', `${specialty.name} a été ajoutée à vos compétences`);
    } catch (err) {
      // Rollback en cas d'erreur
      setMySpecialties(prev => prev.filter(ms => ms.specialtyId !== specialty.id));

      console.error('Erreur ajout spécialité:', err);
      error('Erreur', "Impossible d'ajouter cette spécialité");
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(specialty.id);
        return newSet;
      });
    }
  };

  // Retirer une spécialité
  const handleRemoveSpecialty = async (specialtyId: string) => {
    if (!user?.id) return;

    const specialtyToRemove = mySpecialties.find(ms => ms.specialtyId === specialtyId);
    if (!specialtyToRemove) return;

    setProcessingIds(prev => new Set(prev).add(specialtyId));

    try {
      // Optimistic update
      setMySpecialties(prev => prev.filter(ms => ms.specialtyId !== specialtyId));

      // Appel API
      await specialtyService.removeFromProvider(user.id, specialtyId);

      success(
        'Spécialité retirée',
        `${specialtyToRemove.specialty.name} a été retirée de vos compétences`
      );
    } catch (err) {
      // Rollback en cas d'erreur
      setMySpecialties(prev => [...prev, specialtyToRemove]);

      console.error('Erreur suppression spécialité:', err);
      error('Erreur', 'Impossible de retirer cette spécialité');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(specialtyId);
        return newSet;
      });
    }
  };

  // Modifier le niveau d'une spécialité
  const handleLevelChange = async (specialtyId: string, level: number) => {
    if (!user?.id) return;

    const levelString = ['', 'Débutant', 'Intermédiaire', 'Confirmé', 'Avancé', 'Expert'][level] as
      | 'Débutant'
      | 'Intermédiaire'
      | 'Confirmé'
      | 'Avancé'
      | 'Expert';

    const oldSpecialty = mySpecialties.find(ms => ms.specialtyId === specialtyId);
    if (!oldSpecialty) return;

    setProcessingIds(prev => new Set(prev).add(specialtyId));

    try {
      // Optimistic update
      setMySpecialties(prev =>
        prev.map(ms =>
          ms.specialtyId === specialtyId ? ({ ...ms, level: levelString } as ProviderSpecialty) : ms
        )
      );

      success('Niveau mis à jour', `Niveau de ${oldSpecialty.specialty.name} modifié`);
    } catch (err) {
      // Rollback en cas d'erreur
      setMySpecialties(prev =>
        prev.map(ms => (ms.specialtyId === specialtyId ? oldSpecialty : ms))
      );

      console.error('Erreur modification niveau:', err);
      error('Erreur', 'Impossible de modifier le niveau');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(specialtyId);
        return newSet;
      });
    }
  };

  return {
    // États
    allSpecialties,
    mySpecialties,
    availableSpecialties,
    loading,
    searchQuery,
    processingIds,

    // Actions
    setSearchQuery,
    handleAddSpecialty,
    handleRemoveSpecialty,
    handleLevelChange,
  };
}
