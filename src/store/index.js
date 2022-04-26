import actions from './actions'
import mutations from './mutations'

const state = {
  events: [
    { id: 10, title: 'All day event', date: new Date(), allDay: true },
  ],
  weekendsVisible: true
}

const getters = {
  events: state => state.events,
  weekendsVisible: state => state.weekendsVisible
}

export default {
  state,
  getters,
  mutations,
  actions
}
