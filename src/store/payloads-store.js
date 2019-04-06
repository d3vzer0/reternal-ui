export default {
    namespaced: true,
    state: {
      payload_count: 0,
      build_count: 0,
      payloads: {
        windows: {},
        darwin: {},
        linux: {}
      }
    },
    getters: {
      get_state(state, platform, arch) {
        return state.payloads[platform][arch].build_state;
      },
      get_payloads(state) {
        return state.payloads;
      },
      payload_count(state) {
        return state.payload_count
      },
      build_count(state) {
        return state.build_count
      }
    },
    mutations: {
      clear_state(state) {
        state.build_count = 0
        for (const [platform, types] of Object.entries(state.payloads)) {
          for (const [arch, context] of Object.entries(types)) {
            state.payloads[platform][arch].build_state = 'PENDING'
          }
        }
      },
      add_payloads(state, payloads) {
        state.payload_count = 0
        state.payloads = payloads
        for (const [platform, types] of Object.entries(payloads)) {
          for (const [arch, context] of Object.entries(types)) {
            state.payload_count += 1
          }
        }
      },
      change_state(state, payload) {
        state.payloads[payload.platform][payload.arch].build_state = payload.state
        if (payload.state === 'SUCCESS') {
          state.build_count += 1
        }
      }
    }
  };
  