const NotFound = Vue.component('NotFound', {
    template: `
<div class="text-center vh-100 d-flex flex-column justify-content-center">
  <h1 class="mb-4">No Encontrado</h1>
  <h5>Oops no pudimos encontrar esa página. Pruebe yendo a 
    <router-link :to="{name:'Home'}">Inicio</router-link>
  </h5>
</div>
`});