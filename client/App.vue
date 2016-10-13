<template lang="pug">
  div
    div.text-center#clock
      h1.date {{ day }}
      h1.time {{ clock }}
      h3.date {{ date }}
    div.text-center.pad-top.weather-container
      h4(v-if="weather")
        span It is 
        span.weather {{ weather.temp }}&deg;F 
        span and 
        span.weather {{ weather.sky_now }} 
        br
        span The wind is 
        span.weather {{ weather.wind_speed }} mph 
        span and the humidity is 
        span.weather {{ weather.humidity }}%
        br
        span Today 
        span(v-if="is_afternoon") was to be 
        span(v-else) will be 
        span.weather {{ weather.high }}&deg;F 
        span and 
        span.weather {{ weather.sky_today }}
</template>

<script>
import moment from 'moment'
import config from '../config.js'


export default {
  data() {
    return {
      time: moment(),
      weather: null
    }
  },
  computed: {
    clock() {
      return this.time.format('HH:mm')
    },
    day() {
      return this.time.format('ddd')
    },
    date() {
      return this.time.format('MMM DD')
    },
    is_afternoon() {
      return this.time.hour() > 15
    }
  },
  methods: {
    loadWeather() {
      let stored = localStorage.getItem('weather')
      if (stored != null && stored != undefined) {
        console.log('Loaded weather from localStorage')
        stored = JSON.parse(stored)
        const loaded = moment(stored.loaded)
        if (moment().diff(loaded) < 600000) {
          console.log('Weather information from cache is still valid')
          this.weather = stored
          return
        }
      }
      console.log('Getting new weather information from server ...')
      this.$http.get('http://localhost:3000/weather?token='
        + config.weather.token + '&location=' + config.weather.location).then((response) => {
        const weatherData = JSON.parse(response.data).data
        this.weather = weatherData
        localStorage.setItem('weather', JSON.stringify(weatherData))
      }, (response) => {
        console.log('Error response from server: ' + JSON.stringify(response))
      })
    }
  },
  mounted() {
    setInterval(() => this.time = moment(), 1000)
    setInterval(() => this.loadWeather(), 600000)
    this.loadWeather()
  }
}
</script>

<style lang="stylus">
  [v-cloak]
    display none

  body
    font-family 'Oswald', sans-serif
    animation fadein 1s
    background-image url(http://i.imgur.com/dkFOoi6.jpg)

  @keyframes fadein
    from
      opacity 0

    to
      opacity 1

  .text-center
    text-align center

  #clock
    margin-bottom 3em

  .time
    font-size 12em
    text-shadow 0 0 25px black
    display inline-block

  .date
    font-size 6em
    text-shadow 0 0 15px black
    display inline-block
    margin 0 0.3em 0 0.3em
    position relative
    top: 0.2em

  .pad-top
      padding-top 10em

  .weather
    color rgb(220 149 15)

  .weather-container
    animation fadein 2s
</style>
