<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex>
        <div>
          CATEGORY: {{ getQuestion.category | toUpper }} <br>
          STATUS: {{ status | toUpper }}<br>
          LIFE: {{ life }}<br>
          MISSED: {{ missed }}<br>
          <v-btn :flat="status === 'alive'" color="success" @click="restart">New Game</v-btn>
        </div>
        <div class="hangman">

        </div>
        <div>
          <div v-for="(q, i) in question" :key="`q-${i}`" class="s-box">
            <span class="display-3"
              :style="[!q.hidden ? { opacity: 1 } : { opacity: 0 }]"
            >
              {{ q.char }}</span>
          </div>
        </div>
        <v-container grid-list-md text-xs-center>
          <v-layout row wrap v-for="(v, i) in vKeyboard" :key="`v-${i}`">
            <v-flex v-for="(b, i) in v" :key="`b-${i}`" md1>
              <v-btn dark>{{ b }}</v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import * as _ from 'lodash'

export default {
  data: () => ({
    trigger: false,
    question: [],
    vKeyboard: [],
    missed: [],
    lastQ: '',
    life: 6,
    status: 'alive'
  }),
  mounted () {
    window.addEventListener('keypress', e => this.onKeyPress(e.keyCode))
    this.question = this.createQuestion()
  },
  computed: {
    getQuestion () {
      return this.$store.getters.getQuestion(this.trigger)
    },
    getAlphabet () {
      return this.$store.getters.getAlphabet
    }
  },
  watch: {
    getQuestion () {
      if (this.getQuestion === this.lastQ) return this.restart
      this.question = this.createQuestion()
      this.lastQ = this.getQuestion
    }
  },
  methods: {
    createQuestion () {
      let str = this.getQuestion.word
      return _.map(str, (s) => ({
        char: s,
        hidden: true
      }))
    },
    onKeyPress (code) {
      if (this.status !== 'alive') return
      let char
      (typeof code === 'string') ? char = code : char = String.fromCharCode(code)
      let match = false
      _.forEach(this.question, (q, i) => {
        if (q.char === char) {
          this.question[i].hidden = false
          match = true
        }
      })
      if (!match) {
        this.life--
        this.missed.push(char)
      }
      this.checkHangman()
    },
    checkHangman () {
      let game = _.some(this.question, 'hidden')
      if (!game) {
        this.status = 'win'
      } else {
        if (this.life === 0) {
          this.status = 'dead'
        }
      }
    },
    restart () {
      this.status = 'alive'
      this.life = 5
      this.missed = []
      this.trigger ? this.trigger = false : this.trigger = true
    }
  }
}
</script>

<style scoped>
.s-box {
  display: inline-block;
  border-bottom: 2px solid #7c7c7c;
  width: 4.5rem;
  height: 5rem;
  margin: 0.5rem;
  text-align: center;
}
.hangman {
  display: inline-block;
  border-bottom: 2px solid #7c7c7c;
  width: 128px;
  height: 170px;
  margin: 0.5rem;
  text-align: center;
}
</style>
