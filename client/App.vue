<template lang="pug">
  div
    div.text-center#clock
      h1.date {{ day }}
      h1.time {{ clock }}
      h3.date {{ date }}
    div.text-center.pad-top.weather-container
      h4(v-if="weather")
        span It is 
        span.highlight {{ weather.temp }}&deg;F 
        span and 
        span.highlight {{ weather.sky_now }} 
        br
        span The wind is 
        span.highlight {{ weather.wind_speed }} mph 
        span and the humidity is 
        span.highlight {{ weather.humidity }}%
        br
        span Today 
        span(v-if="is_afternoon") was to be 
        span(v-else) will be 
        span.highlight {{ weather.high }}&deg;F 
        span and 
        span.highlight {{ weather.sky_today }}
    div.text-center.pad-top.travel-container
      h4(v-if="travel_time")
        span.highlight {{ travel_time }} 
        span to {{ travel_destination }}
</template>

<script>
import moment from 'moment'
import config from './config.js'


export default {
  data() {
    return {
      time: moment(),
      weather: null,
      travel_time: null,
      travel_destination: config.travel.end_name
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
      return this.time.hour() >= 15
    }
  },
  methods: {
    loadWeather() {
      let stored = localStorage.getItem('weather')
      if (stored != null && stored != undefined) {
        console.log('Loaded weather from localStorage')
        stored = JSON.parse(stored)
        const loaded = moment(stored.loaded)
        if (this.time.diff(loaded) < 1800000) {
          console.log('Weather information from cache is still valid (less than 30 minutes old)')
          this.weather = stored
          return
        }
      }
      console.log('Getting new weather information from server ...')
      this.$http.get(encodeURI('http://localhost:3000/weather?token='
          + config.weather.token + '&location=' + config.weather.location)).then((response) => {
        const weatherData = JSON.parse(response.data).data
        this.weather = weatherData
        localStorage.setItem('weather', JSON.stringify(weatherData))
      }, (response) => {
        console.log('Error response from server for weather: ' + JSON.stringify(response))
      })
    },
    loadTravel() {
      let stored = localStorage.getItem('travel')
      if (stored != null && stored != undefined) {
        console.log('Loaded travel from localStorage')
        stored = JSON.parse(stored)
        const loaded = moment(stored.loaded)
        if (this.time.diff(loaded) < 300000) {
          console.log('Travel information from cache is still valid (less than 5 minutes old)')
          this.travel_time = stored.time
          return
        }
      }
      console.log('Getting new travel information from server ...')
      this.$http.get(encodeURI('http://localhost:3000/travel?'
          + 'start=' + config.travel.start
          + '&end=' + config.travel.end
          + '&traffic_model=' + config.travel.traffic_model
          + '&units=' + config.travel.units)).then((response) => {
        const travelData = JSON.parse(response.data).data
        this.travel_time = travelData.time
        localStorage.setItem('travel', JSON.stringify(travelData))
      }, (response) => {
        console.log('Error response from server for travel: ' + JSON.stringify(response))
      })
    }
  },
  mounted() {
    setInterval(() => this.time = moment(), 1000)
    setInterval(() => this.loadWeather(), 600000)
    this.loadWeather()
    if (this.time.hour() > 15)
      this.loadTravel()
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

  .highlight
    color rgb(220 149 15)

  .weather-container
    padding-top 10em
    animation fadein 2s

  .travel-container
    padding-top 2em
    animation fadein 4s
</style>
