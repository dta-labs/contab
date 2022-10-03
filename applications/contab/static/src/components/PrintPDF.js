// https://pdfmake.github.io/docs
Vue.component('PrintSheet', {
    computed: {
        ...Vuex.mapState(['config']),
        ...Vuex.mapState('sheet', ['date', 'total2Pay', 'cols', 'rows']),
        cols2Export() {
            let colIndexArray = [0];
            this.cols.slice(1,).forEach((col, i) => {
                if (col.subTotal > 0) colIndexArray.push(i + 1)
            });
            colIndexArray.push(7, 8);
            return colIndexArray
        },
        slicedRows() {
            let slicedRows = [];
            this.rows.forEach((row, i) => {
                slicedRows.push(row.filter((_, i) => this.cols2Export.includes(i)))
            });
            return slicedRows
        }
    },
    methods: {
        generate() {
            pdfMake.createPdf(sheet(
                this.date,
                this.config ? this.config.organizacion || '' : '',
                this.total2Pay,
                this.cols.slice(1,).filter(_ => _.subTotal > 0),
                this.slicedRows
            )).open();
        }
    },
    template: `<div>
  <button
      @click="generate"
      type="button"
      title="Abrir PDF"
      class="btn btn-danger btn-sm fw-bold shadow-none">
    Abrir PDF...
  </button>
</div>`
});

Vue.component('PrintPay', {
    computed: {
        ...Vuex.mapState(['config']),
        ...Vuex.mapState('pay', ['dates', 'granTotal', 'cols', 'rows']),
    },
    methods: {
        generate() {
            pdfMake.createPdf(pay(
                this.dates,
                this.config ? this.config.organizacion || '' : '',
                this.granTotal,
                this.rows
            )).open();
        }
    },
    template: `<div>
  <button
      @click="generate"
      type="button"
      title="Abrir PDF"
      class="btn btn-danger btn-sm fw-bold shadow-none">
    Abrir PDF...
  </button>
</div>`
});

function sheet(date, org, total, cols, rows) {
    const producto = [
        {text: 'Producto', bold: true},
        ...cols.map(_ => _.producto || '-'),
        {text: 'Total', colSpan: 2, bold: true}, {}
    ];
    const subtotal = [
        'Sub-total',
        ...cols.map(_ => _.subTotal),
        {text: '', colSpan: 2}
    ];
    const precio = [
        'Precio',
        ...cols.map(_ => _.precio ? `$${_.precio.toFixed(2)}` : '$0.00'),
        {text: '', colSpan: 2}, {}
    ];
    const body = [
        producto,
        subtotal,
        precio
    ];
    const end = cols.length + 1;
    rows.forEach(_ => body.push([
        ..._.slice(0, end),
        _[_.length - 2],
        '$' + _[_.length - 1].toFixed(2)
    ]));
    return {
        pageMargins: [30, 100, 30, 40],
        footer(currentPage, pageCount) {
            return {text: currentPage.toString() + ' de ' + pageCount, margin: [30, 0], alignment: 'right'};
        },
        header: [
            {text: org, margin: [20, 20, 20, 10], fontSize: 16, bold: true, alignment: 'center'},
            {text: `Reporte del día: ${date}`, margin: [30, 0, 30, 10]},
            {text: `Total a pagar: $${total}`, margin: [30, 0, 30, 10]}
        ],
        content: [
            {
                table: {
                    headerRows: 1,
                    body: body
                },
                layout: {
                    fillColor: function (rowIndex, node, columnIndex) {
                        if (rowIndex < 3) return null;
                        return (rowIndex % 2 === 0) ? null : 'whitesmoke';
                    }
                }
            },
        ]
    };
}

function pay(dates, org, total, rows) {
    const header = [
        {text: 'Tarjeta', bold: true},
        ...dates.map(_ => ({text: _, bold: true})),
        {text: 'Total', bold: true}
    ];
    const body = [
        header,
        ...rows.map(_ => ([
            _.slice(0, 1),
            ..._.slice(1,).map(_ => `$${_.toFixed(2)}`)
        ]))
    ];
    return {
        pageMargins: [30, 100, 30, 40],
        footer(currentPage, pageCount) {
            return {text: currentPage.toString() + ' de ' + pageCount, margin: [30, 0], alignment: 'right'};
        },
        header: [
            {text: org, margin: [20, 20, 20, 10], fontSize: 16, bold: true, alignment: 'center'},
            {text: `Total a pagar: $${total}`, margin: [30, 0, 30, 10]}
        ],
        content: [
            {
                table: {
                    headerRows: 1,
                    body: body
                },
                layout: {
                    fillColor: function (rowIndex, node, columnIndex) {
                        return (rowIndex % 2 === 0) ? null : 'whitesmoke';
                    }
                }
            },
        ]
    };
}