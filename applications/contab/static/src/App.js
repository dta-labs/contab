const app = new Vue({
    el: '#app',
    created() {
        this.$store.dispatch('getConfig');
    },
    store,
    router,
    template: `<div class="vh-100 vstack">
  <Header/>
  <div class="container-fluid flex-fill overflow-hidden">
    <div class="row h-100">
      <div class="col-auto border-right py-3 h-100 overflow-auto shadow-sm"
           style="z-index: 10">
        <div class="h-100 d-flex flex-column">
          <div>
            <SideTab/>
            <keep-alive>
              <router-view name="side"/>
            </keep-alive>
            <br>
            <br>
          </div>
          <div class="mt-auto" style="width: 260px">
            <img src="/contab/static/src/assets/DTA-Labs.png" alt="logo" style="width: 90px;">
            <div class="small pb-2">
              © {{(new Date()).getFullYear()}} por <a class="blue-text" href="https://dta-labs.droppages.com">DTA-Labs</a>. Todos los derechos
              reservados.
              Consulte nuestras polítcas de privacidad y de uso en <a
                href="https://dta-labs.droppages.com/privacidad-es.html">Español</a> / <a
                href="https://dta-labs.droppages.com/privacidad-en.html">Inglés</a>
            </div>
          </div>
        </div>
      </div>
      <div class="col alert-success h-100 overflow-auto">
        <router-view/>
      </div>
    </div>
  </div>
</div>`
});
