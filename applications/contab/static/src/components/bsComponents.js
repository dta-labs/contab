/*
Wrappers for BS components, inspired in Vuetify component API.
*/

// Carousel

Vue.component('Carousel', {
    data: () => ({carousel: null}),
    props: [],
    watch: {},
    mounted() {
        const carouselItems = this.$el.children[0].children;
        if (carouselItems.length) carouselItems[0].classList.add('active');
        this.carousel = new bootstrap.Carousel(this.$el,{
            ride: false,
        });
    },
    methods: {
        to(index) {
            this.carousel.to(index);
        }
    },
    beforeDestroy() {
    },
    template: `<div>
  <div class="carousel-inner">
    <slot/>
  </div>
</div>`
});

Vue.component('CarouselItem', {
    template: `<div class="carousel-item"><slot/></div>`
});


// Modal

Vue.component('Dialog', {
    /*
    Inspired in v-dialog component from Vuetify, it uses a BS Modal...
    */
    props: [
        'value',
        'modal-class',
        'content-class',
        'backdrop',
        // 'backdrop-opacity',
        'max-width',
        'width'
    ],
    watch: {
        value(to) {
            if (to) this.modal.show()
            else this.modal.hide()
        }
    },
    mounted() {
        this.modal = new bootstrap.Modal(this.$el);
        this.style();
        this.value && this.modal.show();
        this.$el.addEventListener('hidden.bs.modal', () => {
            this.$emit('hidden');
            this.$emit('input', false);
        });
        this.$el.addEventListener('shown.bs.modal', () => this.$emit('shown'));
    },
    methods: {
        style() {
            const modalContent = this.$el.querySelector('.modal-content');
            if (this.maxWidth) {
                modalContent.style.maxWidth = this.maxWidth + 'px'
            }
        }
    },
    beforeDestroy() {
        this.modal._isShown && this.modal.dispose();
    },
    template: `<div class="modal fade" :data-bs-backdrop="backdrop">
  <div class="modal-dialog modal-dialog-centered" :class="modalClass">
    <div class="modal-content shadow mx-auto" :class="contentClass">
      <slot/>
    </div>
  </div>
</div>`
});


// Offcanvas

Vue.component('Offcanvas', {
    props: {value: Boolean, offcanvasClass: {default: 'offcanvas-xxl'}},
    watch: {
        value(to) {
            if (to) this.offcanvas.show()
            else this.offcanvas.hide()
        },
        $route() {
            this.$emit('input', false);
        }
    },
    mounted() {
        this.offcanvas = new bootstrap.Offcanvas(this.$el);
        this.$el.addEventListener('hidden.bs.offcanvas', () => this.$emit('input', false));
    },
    beforeDestroy() {
        this.offcanvas._isShown && this.offcanvas.dispose();
        this.$emit('input', false);  // Not very useful but for general purpose
    },
    template: `<div :class="offcanvasClass" class="offcanvas-start w-auto">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title"></h5>
    <button type="button" class="btn-close" @click="$emit('input', false)"/>
  </div>
  <div class="offcanvas-body">
    <slot/> 
  </div>
</div>`
});


// Toast

Vue.component('Toasts', {
    computed: Vuex.mapState(['toasts']),
    template: `<div class="toast-container position-absolute p-4 bottom-0 start-50 translate-middle-x">
  <template v-for="_ in toasts">
    <Toast v-if="_.type&&_.type.toUpperCase()==='BS'" :data="_" :key="_.timestamp"/>
    <ToastAs v-else :data="_" :key="_.timestamp"/>
  </template>
</div>`
});

Vue.component('Toast', {
    props: ['data'],
    methods: Vuex.mapMutations(['clearToasts']),
    mounted() {
        (new bootstrap.Toast(this.$el)).show();
        this.$el.addEventListener('hidden.bs.toast', () => this.clearToasts(this.data.timestamp))
    },
    template: `<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
  <div class="toast-header">
    <svg class="bd-placeholder-img rounded me-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg"
         aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false">
      <rect width="100%" height="100%" fill="#007aff"></rect>
    </svg>
    <strong class="me-auto">{{data.header}}</strong>
    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
  </div>
  <div class="toast-body">
    {{data.body}}
  </div>
</div>`
});

Vue.component('ToastAs', {
    props: ['data'],
    methods: Vuex.mapMutations(['clearToasts']),
    mounted() {
        (new bootstrap.Toast(this.$el)).show();
        this.$el.addEventListener('hidden.bs.toast', () => this.clearToasts(this.data.timestamp))
    },
    template: `<div class="toast rounded-3 overflow-hidden" role="alert" aria-live="assertive" aria-atomic="true">
  <div class="hstack gap-3 bg-dark text-white px-3 py-2">
    <div v-if="data.type==='success'" class="text-success">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
      </svg>
    </div>
    <div v-else> 
      <svg class="bd-placeholder-img rounded me-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg"
           aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false">
        <rect width="100%" height="100%" fill="#007aff"></rect>
      </svg> 
    </div>  
    <div class="toast-body">
      <strong v-if="data.header">{{data.header}}</strong>
      <div v-if="data.body">{{data.body}}</div>
    </div>
    <button type="button" class="btn-close btn-close-white ms-auto" data-bs-dismiss="toast" aria-label="Close"></button>
  </div>
</div>`
});

