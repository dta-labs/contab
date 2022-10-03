Vue.component('Config', {
  data: () => ({
    sending: false
  }),
  mounted() {
    const myOffcanvas = this.$el.querySelector('.offcanvas');
    myOffcanvas.addEventListener('hidden.bs.offcanvas', () =>
      this.$refs.carousel.to(0)
    );
  },
  computed: Vuex.mapState(['config']),
  methods: {
    handlePostErrors(err) {
      alert('Lo sentimos. Ocurrió un error.');
      console.error(err);
    },
    handleFormAccepted() {
      this.$el.querySelector('.btn-close').click();
      this.getConfig();
    },
    ...Vuex.mapActions(['getConfig', 'setConfig']),
    submit({target}) {
      this.sending = true;
      this.setConfig(target)
        .then(res => {
          this.sending = false;
          this.handleFormAccepted();
        })
        .catch(err => this.handlePostErrors(err));
    }
  },
  template: `<div>
  <button class="btn btn-link text-reset" data-bs-toggle="offcanvas" data-bs-target="#configCanvas" data-bs-backdrop="true">
    <i class="bi-gear-fill"/>
  </button>
  <!-- configCanvas -->
  <div class="offcanvas offcanvas-end" tabindex="-1" aria-hidden="true" id="configCanvas">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title">Configuración</h5>
      <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      <div class="container">
        <form @submit.prevent="submit">
          <Carousel ref="carousel" data-bs-interval="false">
            <CarouselItem class="px-1">
              <p class="text-muted my-5">
                Su nombre y su organización, son utilizados para la presentación de reportes.
              </p>
              <input type="text" class="d-none" name="id" value="1">
              <div class="mb-3">
                <label for="inputName" class="form-label">Nombre</label>
                <input type="text" class="form-control" id="inputName" name="usuario" v-model="config.usuario">
              </div>
              <div class="mb-3">
                <label for="inputOrganization" class="form-label">Organización</label>
                <input type="text" class="form-control" id="inputOrganization" name="organizacion"
                      v-model="config.organizacion">
              </div>
              <div class="mt-5 mb-3">
                <input class="btn btn-primary" :disabled="sending" type="submit" value="Guardar cambios">
              </div>
              <br>
              <hr>
              <div class="my-4">
                <a href="#" @click.prevent="$refs.carousel.to(1)" class="text-decoration-none">
                  <i class="bi-gear me-2"></i>
                  <span class="small">Más ajustes</span>
                </a>
              </div>
            </CarouselItem>
            <CarouselItem class="px-1">
              <div class="fw-bold lh-lg hstack gap-3">
                <a class="dropdown-item rounded-circle w-auto hstack" href="#"
                  @click.stop.prevent="$refs.carousel.to(0)" style="padding:0 10px">
                  <i class="bi-arrow-left" style="font-size:20px"></i>
                </a>
                Scanner
              </div>
              <p class="text-muted my-5">
                Regule el tiempo de espera de las entradas de scanner para evitar
                interrupciones durante la lectura de su dispositivo.
              </p>
              <div class="mb-3">
                <label for="inputScanner" class="form-label">Tiempo de espera (en segundos)</label>
                <input type="number" class="form-control w-50" id="inputScanner" name="scanner"
                 min="1" max="20" v-model="config.scanner">
              </div>
              <div class="mt-5 mb-3">
                <input class="btn btn-primary" :disabled="sending" type="submit" value="Guardar cambios">
              </div>
            </CarouselItem>
          </Carousel>
        </form>
      </div>
    </div>
  </div>
</div>`
});
