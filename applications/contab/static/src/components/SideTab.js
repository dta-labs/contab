Vue.component('SideTab', {
    template: `<div class="row px-3" id="sideTab-component">
  <router-link
      :to="{name: 'Sheet'}"
      class="col p-2"
      :class="{active: $route.matched.some(r => r.name === 'Sheet')}">
    REGISTROS
  </router-link>
  <router-link
      :to="{name: 'Pay'}"
      class="col p-2"
      :class="{active: $route.name==='Pay'}">
    PAGAR
  </router-link>
</div>`
});
