<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
let name: string = "Hello32";
</script>

<template>
  <div>
    {#if name==='Hello32'}
    <img alt="Vue logo" src="./assets/logo.png" />
    {:else if name==='Hel3lo32'}
    <div>First time doing vite plugins</div>
    {:else}
     {@html
      <h1>Coders for life</h1>
     } 
    {/if}
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
