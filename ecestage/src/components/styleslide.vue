<template>
  <section class="mnu">
<slot></slot></section>
</template>
<style scoped>

.mnu {
    border-radius: 20px;
    background: linear-gradient(45deg, #017179, #02b7c4);
    color: white;
    height: calc(100% - 20px);
    padding: 15px;
    margin: 10px 0px 10px 10px;
    font-family: 'Montserrat', sans-serif;
    overflow-y: auto;
}
</style>