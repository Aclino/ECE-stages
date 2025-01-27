document.getElementById('le-dev-me-soule').addEventListener('submit', (event) =>{
    event.preventDefault(); 

    // Récupérer les valeurs des champs
    const email = document.getElementById('email').value;
    console.log(email);
    const password = document.getElementById('password').value;
    console.log(password);


    // Créer un objet avec les données à envoyer
    const userData = {
      email,
      password
    };
console.log(userData);});