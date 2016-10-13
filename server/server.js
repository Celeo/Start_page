import express from 'express'
import cors from 'cors'
import request from 'request'
import moment from 'moment'


const app = express()
app.use(cors())

/* ==================================
        Weather conditions
================================== */
app.get('/weather', (req, res) => {

  const token = req.query.token
  const location = req.query.location
  if (token == undefined || location == undefined) {
    res.send(JSON.stringify({
      data: null,
      message: 'Missing parameters `token` and/or `location`'
    }))
    return
  }
  const url = encodeURI(`https://api.darksky.net/forecast/${token}/${location}`)

  request(url, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const data = JSON.parse(body)
      const currently = data.currently
      const today = data.daily.data[0]
      const display = {
        wind_speed: parseInt(currently.windSpeed),
        wind_direction: parseInt(currently.windBearing),
        humidity: parseInt(currently.humidity * 100),
        sky_now: currently.summary,
        temp: parseInt(currently.temperature),
        high: parseInt(today.temperatureMax),
        high_time: moment.unix(today.temperatureMaxTime).valueOf(),
        sky_today: today.summary.toLowerCase(),
        loaded: moment().valueOf()
      }
      res.send(JSON.stringify({data: display}))
    } else {
      console.log('Something went wrong in the weather HTTP request (code ' + response.statusCode + '): ' + error)
      res.send(JSON.stringify({
        data: null,
        message: 'Something went wrong in the HTTP request'
      }))
    }
  })

})

/* ==================================
      Travel time (to home)
================================== */
app.get('/travel', (req, res) => {

  const start = req.query.start
  const end = req.query.end
  const traffic_model = req.query.traffic_model
  const units = req.query.units
  if (start == undefined || end == undefined || traffic_model == undefined || units == undefined) {
    res.send(JSON.stringify({
      data: null,
      message: 'Missing parameters `start`, `end`, `traffic_model`, and/or `units`'
    }))
    return
  }
  const url = encodeURI(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${start}&destinations=${end}`
      + `&departure_time=now&traffic_model=${traffic_model}&units=${units}`)

  request(url, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const data = JSON.parse(body)
      const display = {
        time: data.rows[0].elements[0].duration.text,
        loaded: moment().valueOf()
      }
      res.send(JSON.stringify({data: display}))
    } else {
      console.log('Something went wrong in the travel HTTP request (code ' + response.statusCode + '): ' + error)
      res.send(JSON.stringify({
        data: null,
        message: 'Something went wrong in the HTTP request'
      }))
    }
  })

})

/* ==================================
        Start the server
================================== */
app.listen(3000, () => {
  console.log('App listening on port 3000')
})
