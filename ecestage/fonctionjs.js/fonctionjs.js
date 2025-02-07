export function isTokenExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Décoder la charge utile du JWT
      const expiration = payload.exp * 1000; // Convertir en millisecondes
      return Date.now() > expiration; // Vérifier si le token est expiré
    } catch (error) {
      return true; // Considérer comme expiré si le token est invalide
    }
  }
  