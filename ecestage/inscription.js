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

document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Empêche la soumission normale du formulaire

    const email = document.getElementById('email').value;
    const mot_de_passe = document.getElementById('mot_de_passe').value;

    try {
        const response = await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, mot_de_passe }),
        });

        const result = await response.json();

        if (response.ok) {
            // Stocker le token dans le stockage local ou session
            localStorage.setItem('token', result.token);

            document.getElementById('message').style.color = 'green';
            document.getElementById('message').textContent = 'Connexion réussie ! Redirection en cours...';

            // Redirection après la connexion réussie
            setTimeout(() => {
                window.location.href = 'acceuil.html'; // Page après connexion
            }, 2000);
        } else {
            document.getElementById('message').textContent = result.error || 'Erreur inconnue.';
        }
    } catch (error) {
        console.error(error);
        document.getElementById('message').textContent = 'Erreur lors de la connexion.';
    }
});

  });