/**
 * Génère un ID unique avec une précision accrue
 */
export function generateUniqueId(): string {
  // Combinaison de timestamp avec une précision plus fine + random + compteur
  const timestamp = Date.now();
  const highPrecision = performance.now().toString(36);
  const random1 = Math.random().toString(36).substring(2);
  const random2 = Math.random().toString(36).substring(2);
  
  return `${timestamp}-${highPrecision}-${random1}${random2}`;
}

/**
 * Génère un ID temporaire spécifique pour les spécialités
 */
export function generateTempSpecialtyId(): string {
  return `temp-specialty-${generateUniqueId()}`;
}

/**
 * Vérifie si un ID est temporaire
 */
export function isTempId(id: string): boolean {
  return id.startsWith('temp-');
}
