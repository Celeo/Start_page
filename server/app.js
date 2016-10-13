import express from 'express'
import cors from 'cors'
import request from 'request'
import moment from 'moment'

import config from './config.js'


const app = express()
app.use(cors())

app.get('/weather', (req, res) => {
  const url = 'https://api.darksky.net/forecast/' + config.weather.token + '/' + config.weather.location
  console.log('Querying "' + url + '" for data ...')

  request(url, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const data = JSON.parse(body)
      const currently = data.currently
      const today = data.daily.data[0]
      const display = {
        wind_speed: currently.windSpeed,
        wind_direction: currently.windBearing,
        humidity: currently.humidity * 100,
        sky_now: currently.summary,
        temp: currently.temperature,
        high: today.temperatureMax,
        high_time: moment.unix(today.temperatureMaxTime).valueOf(),
        sky_today: today.summary.toLowerCase(),
        loaded: moment().valueOf()
      }
      res.send(JSON.stringify({data: display}))
    } else {
      console.log('Something went wrong in the HTTP request (code ' + response.statusCode + '): ' + error)
      res.send(JSON.stringify({
        data: null,
        message: 'Something went wrong in the HTTP request'
      }))
    }
  })
})

app.listen(3000, () => {
  console.log('App listening on port 3000')
})
