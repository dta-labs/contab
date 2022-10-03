Vue.component('Header', {
    computed: Vuex.mapState(['config']),
    template: `<nav class="navbar navbar-light" style="-background-color: rgb(21, 47, 70)">
  <div class="container-fluid">
    <div class="navbar-brand">
      <img src="/contab/static/src/assets/logo.png" class="ms-1 me-3" width="24"/>
      <span class="fw-bold">Contab</span>
    </div>
    <div class="navbar-brand fw-bold text-success text-center">
      {{config&&config.organizacion}}
    </div>
    <div class="hstack gap-1 text-dark">
      <Exclude/>
      <Config/>
    </div>
  </div>
</nav>`
});
