const SidePay = Vue.component('SidePay', {
    mounted() {
        const elem = document.getElementById('foo');
        const datepicker = new Datepicker(elem, {
            format: 'yyyy-mm-dd',
            language: 'es',
            maxNumberOfDates: 0
        });
        elem.addEventListener('changeDate', ev => {
            this.setDates(ev.detail.date)
        });
    },
    methods: Vuex.mapActions('pay', ['setDates']),
    template: `<div class="py-4">
  <div id="foo" class="border rounded"></div>
</div>`
});

const Pay = Vue.component('Pay', {
    created() {
        if (this.dates && this.dates.length) this.getData(this.dates);
        // The problem is that changing data in Sheet component, does not updated Pay data automatically
    },
    methods: {
        ...Vuex.mapActions('pay', ['getData'])
    },
    computed: {
        ...Vuex.mapState(['config', 'excluded']),
        ...Vuex.mapState('pay', ['dates', 'cols', 'rows', 'granTotal'])
    },
    template: `<div class="container pt-2 h-100">
  <template v-if="dates&&dates.length">
    <div class="hstack">
      <div class="ms-auto border border-dark border-3 text-center bg-white"
           style="width: 200px;height: 71px;">
        <p class="font-weight-bold mb-1">Total a pagar:</p>
        <h4 class="">{{'$'+granTotal}}</h4>
      </div>
    </div>
    <br>
    <div style="height: calc(100% - 140px);" class="overflow-auto pe-3">
      <div class="mb-3 hstack">
        <div class="vr me-3"></div>
        <PrintPay/>
      </div>
      <table class="table table-sm table-striped table-borderless w-auto mb-0"
             id="sheetTable" v-if="rows"
             style="border-collapse: separate;border-spacing: 0; table-layout: fixed">
        <colgroup>
          <col :span="dates.length+2" style="min-width: 120px"/>
        </colgroup>
        <thead class="text-center position-sticky" style="top:0">
        <tr class="bg-white">
          <th>Tarjeta</th>
          <th v-for="date in dates">{{date}}</th>
          <th>Total</th>
        </tr>
        </thead>
        <tbody class="bg-white">
        <tr v-if="!rows.length">
          <td>#</td>
          <td v-for="_ in dates">$0.00</td>
          <th>$0.00</th>
        </tr>
        <tr v-for="row in rows" :key="row[0]" class="tr-data">
          <th>{{row[0]}}</th>
          <th v-for="value in row.slice(1,)">{{'$'+value.toFixed(2)}}</th>
        </tr>
        </tbody>
      </table>
    </div>
    <br>
  </template>
  <h3 v-else class="text-center" style="margin-top: 25%">PAGAR</h3>
</div>`
});
