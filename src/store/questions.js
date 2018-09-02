import hangman from '@/assets/hangman.json'
import _ from 'lodash'

const state = {
  questions: hangman.questions,
  alphabet: hangman.alphabet
}

const mutations = {
}

const actions = {
}

const getters = {
  getAlphabet: state => state.alphabet,
  getQuestion: state => v => state.questions[_.random(0, (state.questions.length - 1))]
}

export default {
  state,
  getters,
  mutations,
  actions
}
