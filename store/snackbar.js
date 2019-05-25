
const state = () => ({
    snack: '',
})

const mutations = {
    setSnack(state, payload) {
        state.snack = payload
        // state.color = color
    }
}

const getters = {
    snack: function (state) {
        return state.snack;
    },
    color: function (state) {
        return state.color;
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    getters // <== make sure this is defined
}