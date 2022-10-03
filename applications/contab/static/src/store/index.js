axios.defaults.baseURL = '/contab/';
axios.defaults.timeout = 5000;
axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response) {
      console.log(error.response);
      alert(
        '[ERROR] ' +
          error.response.status +
          ' ' +
          error.response.statusText +
          '. Please, reload the page.'
      );
    }
    alert(error); // e.g. timeout
    return Promise.reject(error);
  }
);

Vue.use(Vuex);

const moduleSheet = {
  namespaced: true,
  state: () => ({
    data: null, // Automatic update on data change
    date: null, // String like 2020-10-06
    cols: null,
    rows: null,
    total2Pay: 0, // Total to pay in the day
    granTotal: 0,
    cardList: [] // Also contains the excluded cards (just for Exclude component)
  }),
  mutations: {
    setData(state, data) {
      state.data = data;
    },
    setDate(state, data) {
      state.date = data;
    },
    setCols(state, data) {
      state.cols = data;
    },
    setRows(state, data) {
      state.rows = data;
    },
    setTotal2Pay(state, data) {
      state.total2Pay = data;
    },
    setGranTotal(state, data) {
      state.granTotal = data;
    },
    setCardList(state, data) {
      state.cardList = data;
    }
  },
  getters: {
    excluded(state, getters, rootState) {
      return rootState.excluded;
    }
  },
  actions: {
    setDate({commit, dispatch}, date) {
      const dateISOString = date.toISOString().slice(0, 10);
      commit('setDate', dateISOString);
      dispatch('getData', dateISOString);
    },
    async getData({commit, dispatch}, date) {
      await axios
        .get('/api/registro', {params: {fecha: date}})
        .then(res => {
          // res.data is a record from database or null
          commit('setData', {
            fecha: date,
            dato: res.data ? JSON.parse(res.data.dato) : []
          });
        })
        .catch(() => {});
      dispatch('calculate');
    },
    async setData({state, dispatch}, data) {
      await axios.post('/api/registro', data).catch(err => {});
      dispatch('getData', state.date);
    },
    updateData({state, dispatch}, {colIndex, data}) {
      const newData = {...state.data};
      const index = newData.dato.findIndex(_ => _.col === colIndex);
      if (index >= 0) {
        newData.dato[index] = {...newData.dato[index], ...data};
      } else {
        newData.dato.push({col: colIndex, ...data});
      }
      dispatch('setData', newData);
    },
    calculate({state, commit, getters}) {
      const cols = new Cols(state.data, getters.excluded);
      const rows = new Rows(cols);
      commit('setCols', cols);
      commit('setRows', rows);
      commit('setTotal2Pay', rows.total2Pay().toFixed(2));
      commit('setGranTotal', cols.granTotal());
      commit('setCardList', cols.cardList(true));
    }
  }
};

const modulePay = {
  namespaced: true,
  state: () => ({
    data: null,
    dates: null, // Array like [2020-10-05, 2020-10-11]
    cols: null,
    rows: null,
    granTotal: 0, // Total to pay in the period
    cardList: [] // Also contains the excluded cards (just for Exclude component)
  }),
  mutations: {
    setData(state, data) {
      state.data = data;
    },
    setDates(state, dates) {
      state.dates = dates.sort();
    },
    setCols(state, data) {
      state.cols = data;
    },
    setRows(state, data) {
      state.rows = data;
    },
    setGranTotal(state, data) {
      state.granTotal = data;
    },
    setCardList(state, data) {
      state.cardList = data;
    }
  },
  getters: {
    excluded(state, getters, rootState) {
      return rootState.excluded;
    }
  },
  actions: {
    setDates({state, commit, dispatch}, dates) {
      const datesISOString = dates.map(date => date.toISOString().slice(0, 10));
      commit('setDates', datesISOString);
      dispatch('getData', datesISOString);
    },
    async getData({state, commit, dispatch}, datesISOString) {
      await axios
        .get('/api/registro', {params: {range: JSON.stringify(datesISOString)}})
        .then(res => {
          commit('setData', res.data);
        })
        .catch(err => {});
      dispatch('calculate');
    },
    calculate({state, commit, getters}) {
      const cols = new PayCols(state.dates, state.data, getters.excluded);
      const rows = new PayRows(state.dates, cols);
      commit('setCols', cols);
      commit('setRows', rows);
      commit('setGranTotal', rows.granTotal().toFixed(2));
      commit('setCardList', cols.cardList(true));
    }
  }
};

const store = new Vuex.Store({
  modules: {
    sheet: moduleSheet,
    pay: modulePay
  },
  state: () => ({
    config: {
      usuario: null,
      organizacion: null,
      scanner: 10
    },
    excluded: []
  }),
  mutations: {
    setConfig(state, data) {
      state.config = data;
    },
    setExcluded(state, data) {
      state.excluded = data;
    }
  },
  actions: {
    async getConfig({commit}) {
      await axios
        .get('/api/config')
        .then(res => res.data && commit('setConfig', res.data))
        .catch(err => {});
    },
    setConfig(context, form) {
      const data = new FormData(form);
      return axios.post('/api/config', data).catch(() => {});
    },
    exclude({state, commit, dispatch}, {card, checked}) {
      if (!checked) {
        // exclude, the same as include it in cardExcluded
        commit('setExcluded', [
          ...state.excluded.filter(_ => _ !== card),
          card
        ]);
      } else {
        // the opposite, exclude it from cardExclude
        commit('setExcluded', [...state.excluded.filter(_ => _ !== card)]);
      }
      try {
        dispatch('sheet/calculate');
      } catch (e) {}
      try {
        dispatch('pay/calculate');
      } catch (e) {}
    }
  }
});
