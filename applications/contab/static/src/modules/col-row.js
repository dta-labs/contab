class Col {
    constructor(colData = {}) {
        this.col = colData.col;
        this.producto = colData.producto;
        this.precio = colData.precio;
        this.scanner = colData.scanner || [];
        this.dato = {};
        this.scanner.forEach(raw => {
            raw.split(' ').forEach(value => {
                this.dato[value] = this.dato[value] ? this.dato[value] + 1 : 1;
            })
        })  // convert ["1 2 2", "4 5 5"] into {1:1, 2:2, 4:1, 5:2}
    }

    get subTotal() {
        let subTotal = 0;
        if (this.dato)
            Object.values(this.dato).forEach(value => subTotal += value);
        return subTotal;
    }

    get cardsList() {
        return this.dato ? Object.keys(this.dato) : []
    }

    cardValue(card) {
        return this.dato ? this.dato[card] || 0 : 0
    }
}

class Cols extends Array {  // Array is exotic, so extending form it is exotic too
    constructor(registro) {  // 'registro' is an Array or null
        super();
        this.push(null);
        for (let i = 1; i <= 6; i++)  // 'registro.dato' like [{col: 1, ...}, ...]
            this.push(new Col(registro.dato.find(({col}) => col === i)));
    }

    cardsList = () => {  // Seems like it's not supporting shorthand method definitions
        const cardList = [];
        for (let i = 1; i <= 6; i++) {
            this[i].cardsList.forEach(card => {
                if (card && !cardList.includes(card)) cardList.push(card);
            })
        }
        // By default, the sort() function sorts values as strings
        // It can be fixed by providing a compare function (https://www.w3schools.com/js/js_array_sort.asp)
        return cardList.sort((a, b) => a - b);
    };

    granTotal = () => {
        let granTotal = 0;
        this.slice(1,).forEach(col => granTotal += col.subTotal);
        return granTotal
    }
}

class Rows extends Array {
    constructor(cols) {
        super();
        cols.cardsList().forEach(card => {
            const row = [card, 0, 0, 0, 0, 0, 0];
            let sum = 0, total = 0;
            for (let i = 1; i <= 6; i++) {
                row[i] = cols[i].cardValue(card);
                sum += row[i];
                total += row[i] * (cols[i].precio || 0);
            }
            row.push(sum);
            row.push(total);
            this.push(row);
        })
    }

    total2Pay = () => {
        let total2Pay = 0;
        this.forEach(e => {
            total2Pay += e[8]
        });
        return total2Pay
    }
}

class PayCol extends Object {
    constructor(registro = {}) {
        super();
        if (registro.dato) {
            const json = JSON.parse(registro.dato);
            json.forEach(({precio = 0, scanner = []}) => {
                scanner.forEach(raw => {  // scanner ["1 2 2", "4 5 5"]
                    raw.split(' ').forEach(value => {
                        this[value] = this[value] ? this[value] + precio : precio;
                    })
                })
            })
        }
    }
}

class PayCols extends Object {
    constructor(fechasISOList, registros) {
        super();
        fechasISOList.forEach(fechaISO => {
            this[fechaISO] = new PayCol(registros.find(({fecha}) => fecha === fechaISO))
        });
    }

    cardsList = () => {  // Seems like it's not supporting shorthand method definitions
        const cardList = [];
        Object.values(this).forEach(col => {
            Object.keys(col).forEach(card => {
                if (card && !cardList.includes(card)) cardList.push(card);
            })
        });
        // By default, the sort() function sorts values as strings
        // It can be fixed by providing a compare function (https://www.w3schools.com/js/js_array_sort.asp)
        return cardList.sort((a, b) => a - b);
    }
}

class PayRows extends Array {
    constructor(datesISOString, cols) {
        super();
        this.totalSum = 0;
        cols.cardsList().forEach(card => {
            const row = [card];
            let total = 0;
            datesISOString.forEach(dateISOString => {
                row.push(cols[dateISOString][card] || 0);
                total += cols[dateISOString][card] || 0;
            });
            this.totalSum += total;
            row.push(total);
            this.push(row)
        });
    }

    granTotal = () => {
        return this.totalSum
    }
}

