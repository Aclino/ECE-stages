<template>
<slot></slot>
</template>
<style>
slot{
    cursor: pointer;
  background-color: #e3e3e3;
  color: black;
  padding: 8px 15px;
  display: inline-block;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}
slot:hover{
    background-color: #c3c3c3;
}
</style>