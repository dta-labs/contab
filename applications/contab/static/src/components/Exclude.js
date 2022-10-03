Vue.component('Exclude', {
    computed: {
        show() {
            return this.$route.matched.some(_ => ['Pay', 'Sheet'].includes(_.name))
        },
        cardList() {
            if (this.$route.matched.some(_ => _.name === 'Sheet')) {
                return this.$store.state.sheet.cardList
            } else {
                return this.$store.state.pay.cardList
            }
        },
        ...Vuex.mapState(['excluded']),
        ...Vuex.mapState('sheet', ['date']),
        ...Vuex.mapState('pay', ['dates']),
    },
    methods: {
        click(ev) {
            if (!ev.target.classList.contains('close')) ev.stopPropagation();
        },
        change(card, checked) {
            this.exclude({card, checked});
        },
        ...Vuex.mapActions(['exclude']),
    },
    template: `<div class="dropdown" v-if="show">
  <button
      :disabled="!cardList.length"
      class="btn btn-link text-reset"
      data-bs-toggle="dropdown">
    <i class="fas fa-filter"/>
  </button>
  <div class="dropdown-menu dropdown-menu-end px-2 shadow" @click="click($event)"> 
    <div class="border overflow-auto px-3 py-2" style="height:30vh"> 
      <div v-for="card in cardList" :key="card">
        <input
            type="checkbox"
            :checked="!excluded.includes(card)"
            @change="change(card, $event.target.checked)"/>
        {{card}}
      </div>
    </div>
    <div class="d-flex pt-2"> 
    <button class="btn btn-sm btn-secondary ms-auto close">
      Aceptar
    </button>
    </div>
  </div>
</div>`
});