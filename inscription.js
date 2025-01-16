document.getElementById('le-dev-me-soule').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêche la soumission du formulaire standard

    // Récupérer les valeurs des champs
    const email = document.getElementById('email').value;
    const nom = document.getElementById('nom').value;
    const prenom = document.getElementById('prenom').value;
    const code = document.getElementById('code').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Vérifier si les mots de passe correspondent
    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    // Créer un objet avec les données à envoyer
    const userData = {
      email,
      nom,
      prenom,
      code,
      password
    };
console.log(userData);
    // Envoyer les données au backend via une requête POST
    fetch('http://localhost:3001/api/inscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Utilisateur ajouté avec succès!');
        window.location.href = 'connection.html'; // Rediriger vers la page de connexion
      } else {
        alert('Erreur lors de l\'inscription. Veuillez réessayer.');
      }
    })
    .catch(error => {
      console.error('Erreur:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    });
  });