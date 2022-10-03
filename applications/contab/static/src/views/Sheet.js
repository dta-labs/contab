const Side = Vue.component('Side', {
  mounted() {
    const elem = document.getElementById('foo');
    const datepicker = new Datepicker(elem, {
      format: 'yyyy-mm-dd',
      language: 'es'
    });
    elem.addEventListener('changeDate', ev => {
      this.setDate(ev.detail.date);
    });
  },
  methods: Vuex.mapActions('sheet', ['setDate']),
  template: `<div class="py-4">
  <div id="foo" class="border rounded"></div>
</div>`
});

const Sheet = Vue.component('Sheet', {
  data: () => ({component: 'Grid'}),
  computed: {
    ...Vuex.mapState(['config', 'excluded']),
    ...Vuex.mapState('sheet', [
      'date',
      'total2Pay',
      'cols',
      'rows',
      'granTotal'
    ])
  },
  methods: {
    ...Vuex.mapActions('sheet', ['updateData']),
    update(colIndex, data) {
      this.updateData({colIndex, data});
    }
  },
  template: `<div class="container pt-2 h-100">
  <template v-if="date">
  <div class="hstack">
    <h5 class="text-dark w-100 fw-bold align-self-end">
      <i class="bi-calendar3 me-2"/> <small>{{date}}</small>
    </h5>
    <button
        v-if="component==='Scanner'"
        @click="component='Grid'"
        class="btn btn-lg btn-success shadow-sm"
        style="width: 100px;height: 71px">
      <i class="fa fa-check-double fa-2x"></i>
    </button>
    <button
        v-if="component==='Grid'"
        @click="component='Scanner'"
        class="btn btn-lg btn-success shadow-sm"
        style="width: 100px;height: 71px">
      <img src="/contab/static/src/assets/scanner.svg"/>
    </button>
  </div>
  <br>
  <component :is="component"></component>
  </template>
  <h3 v-else class="text-center" style="margin-top: 25%">REGISTROS DIARIOS</h3>
</div>`
});

const Grid = Vue.component('Grid', {
  computed: {
    ...Vuex.mapState(['config', 'excluded']),
    ...Vuex.mapState('sheet', [
      'date',
      'total2Pay',
      'cols',
      'rows',
      'granTotal'
    ])
  },
  methods: {
    ...Vuex.mapActions('sheet', ['updateData']),
    update(colIndex, data) {
      this.updateData({colIndex, data});
    }
  },
  template: `<div style="height: calc(100% - 140px);" class="overflow-auto pe-3">
  <div class="mb-3 hstack">
    <div class="vr me-3"></div>
    <PrintSheet/>
  </div>
  <table
      v-if="cols"
      id="sheetTable"
      class="table table-sm table-striped table-borderless mb-0"
      style="border-collapse: separate;border-spacing: 0; table-layout: fixed">
    <thead class="text-center position-sticky" style="top:0">
    <tr class="small alert-success">
      <th class="border-start-0 border-top-0 border-end-0"></th>
      <th v-for="n in 6" class="border-start-0 border-top-0 border-end-0">{{n}}</th>
      <th colspan="2" class="border-start-0 border-top-0 border-end-0"></th>
    </tr>
    <tr class="bg-white">
      <th class="text-start">Producto</th>
      <th v-for="n in 6" :key="n" class="p-0 overflow-hidden">
        <producto-input @change="update(n, $event)" :value="cols[n].producto"/>
      </th>
      <th colspan="2" rowspan="3"><h2 style="font-size: 3em">{{granTotal}}</h2>Total</th>
    </tr>
    <tr class="bg-white">
      <th class="text-start">Sub-total</th>
      <th v-for="n in 6" :key="n">{{cols[n].subTotal}}</th>
    </tr>
    <tr class="bg-white">
      <th class="text-start">Precio</th>
      <th v-for="n in 6" :key="n" class="p-0 overflow-hidden">
        <precio-input @change="update(n, $event)" :value="cols[n].precio"/>
      </th>
    </tr>
    </thead>
    <tbody class="bg-white">
    <tr v-if="!rows.length">
      <td>#</td>
      <td v-for="n in 6">0</td>
      <th>0</th>
      <th>$0.00</th>
    </tr>
    <tr v-for="row in rows" :key="row[0]" class="tr-data">
      <th>{{row[0]}}</th>
      <td>{{row[1]}}</td>
      <td>{{row[2]}}</td>
      <td>{{row[3]}}</td>
      <td>{{row[4]}}</td>
      <td>{{row[5]}}</td>
      <td>{{row[6]}}</td>
      <th>{{row[7]}}</th>
      <th>{{'$' + row[8].toFixed(2)}}</th>
    </tr>
    </tbody>
  </table>
</div>`
});

const Scanner = Vue.component('Scanner', {
  beforeRouteEnter(to, from, next) {
    if (!store.state.sheet.date) return router.push({name: 'Sheet'});
    next();
  },
  computed: {
    ...Vuex.mapState(['config']),
    ...Vuex.mapState('sheet', ['date', 'cols'])
  },
  methods: {
    ...Vuex.mapActions('sheet', ['updateData']),
    update(colIndex, data) {
      this.updateData({colIndex, data});
    }
  },
  template: `<div>
  <p class="font-weight-bold">Descargue los datos del scanner aquí.</p>
  <p class="">Seleccione la columna correspondiente a su número de producto.</p>
  <br>
  <div class="row">
    <div v-for="n in 6" class="col">
      <scanner-group
          :col="n"
          :scanner="cols&&cols[n].scanner"
          @change="update(n, $event)"
      />
    </div>
  </div>
</div>`
});

Vue.component('producto-input', {
  data: () => ({
    sendValue: '' // used to control when to fire the 'change event'
  }),
  props: ['value'],
  methods: {
    change({target}) {
      if (this.sendValue !== target.value) {
        this.sendValue = target.value;
        this.$emit('change', {producto: target.value});
      }
    }
  },
  template: `<input
    class="form-control border-0 rounded-0" style="padding:.3rem;height:unset;background-color: #fff3cd;"
    :value="value"
    @keydown.enter="change"
    @blur="change"
>`
});

Vue.component('precio-input', {
  data: () => ({
    prev: '', // used to revert 'target.value' if needed
    key: 0
  }),
  props: ['value'],
  computed: {
    valueString() {
      if (this.value === undefined || this.value === null) return '';
      return '$' + this.value.toFixed(2);
    }
  },
  methods: {
    input({target}) {
      // editing...
      if (target.value) {
        const regexp = /^\d+$/,
          regexp2 = /^\d+\.\d{0,2}$/; // ^\d+(\.\d{1,2})?$ for final test
        if (regexp.test(target.value) || regexp2.test(target.value)) {
          this.prev = target.value;
        } else {
          target.value = this.prev;
        }
      }
    },
    change({target}) {
      // end of edition
      target.value = target.value.replace('$', '');
      if (target.value === '') {
        if (this.value)
          // means that input was emptied
          alert('Este campo no puede estar vacio.');
      } else if (this.value !== parseFloat(target.value)) {
        this.$emit('change', {precio: parseFloat(target.value)});
        return;
      }
      this.key++; // returns target.value to valueString
    },
    focus({target}) {
      target.value = target.value.replace('$', '');
    }
  },
  template: `
<input class="form-control border-0 rounded-0 text-danger"
       style="padding:.3rem;height:unset;background-color: #fff3cd;"
       :value="valueString"
       @keydown.enter="$event.target.blur()"
       @blur="change"
       @input="input"
       @focus="focus"
       :key="key"
       placeholder="$0.00"
>`
});

Vue.component('scanner-group', {
  data: () => ({active: false}),
  props: ['col', 'scanner'],
  methods: {
    insert(ev) {
      this.active = false;
      this.scanner.push(ev);
      this.$emit('change', {scanner: this.scanner});
    },
    remove(index) {
      this.scanner.splice(index, 1);
      this.$emit('change', {scanner: this.scanner});
    },
    forceInput() {
      console.log(123);
    }
  },
  template: `<div>
  <scanner-input v-if="active" @blur="active=false" @input="insert" />
  <button v-else class="btn btn-light w-100 shadow-sm" @click="active=true" style="padding:.3rem">
    {{col}} <i class="fas fa-download"></i>
  </button>
  <scanner-summary v-for="(raw, i) in scanner" :key="i" :data="raw" @remove="remove(i)"/>
</div>`
});

Vue.component('scanner-summary', {
  data: () => ({width: '0'}),
  props: ['data'],
  computed: {
    summary() {
      const summary = {},
        cards = [];
      this.data.split(' ').forEach(e => !cards.includes(e) && cards.push(e));
      summary.cards = cards.length;
      summary.total = this.data.split(' ').length;
      return summary;
    }
  },
  methods: {
    del() {
      if (confirm('Desae eliminar esta lectura?')) this.$emit('remove');
    }
  },
  template: `<div
    class="alert alert-warning my-2 shadow-sm"
    @mouseenter="width='50px'" @mouseleave="width='0'">
  <button
      class="btn btn-danger p-0 border-0" title="Eliminar esta lectura"
      @click="del"
      style="position:absolute;top:0;right:0;bottom:0;opacity:.6;overflow:hidden;transition:.2s"
      :style="{width:width}">
    <i class="bi-x-circle fs-2"></i>
  </button>
  Registros: {{summary.total}}<br>
  Tarjetas: {{summary.cards}}
</div>`
});

Vue.component('scanner-input', {
  // https://stackoverflow.com/questions/21633537/javascript-how-to-read-a-hand-held-barcode-scanner-best
  // Timer-based vs Prefix-based
  data: () => ({
    value: '', // String like '1 2 2 3 1 2 3 4'
    timeOut: null,
    reading: null
  }),
  computed: Vuex.mapState(['config']),
  mounted() {
    this.$el.querySelector('input').focus();
  },
  methods: {
    input() {
      this.reading = true;
      const timeout = this.config.scanner * 1000;
      if (this.timeOut) clearTimeout(this.timeOut);
      this.timeOut = setTimeout(() => this.commitInput(), timeout);
    },
    commitInput() {
      if (this.value) {
        const raw = this.value.trim().replace(/  +/g, ' '); // replace '1  1 ' with '1 1'
        raw && this.$emit('input', raw);
      }
    },
    blur({relatedTarget}) {
      this.$el.contains(relatedTarget) && this.commitInput();
      this.$emit('blur');
    }
  },
  template: `<div class="position-relative">
  <div v-if="reading" class="position-absolute w-100 bottom-100">
    <button class="btn btn-success btn-sm mb-1 w-100 shadow">
      Confirmar
    </button>
  </div>
  <input
    class="form-control"
    style="padding:.3rem;height:unset;background-color: #fff3cd;"
    v-model="value"
    @keydown.enter="value+=' '"
    @input="input"
    @blur="blur"
>
</div>
`
});
