<template>
  <footer>
        <a href="#">A Propos</a>
        <a>|</a>
        <a href="#">Contact</a>
        <a>|</a>
        <a href="#">Actualités</a>
    </footer>
</template>
<script>
</script>
<style>
footer {
    background-color: #335353;
    color: white;
    text-align: center;
    height:5vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

footer nav ul {
    list-style: none;
    padding: 0;
    display: flex;
    justify-content: center;
    gap: 20px;
}

footer  a {
    color: white;
    text-decoration: none;
    padding : 0px 8px 0px 8px;
    font-family: 'Montserrat', sans-serif;
}
</style>