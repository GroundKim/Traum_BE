require('dotenv').config()
const env = process.env

const { InfluxDB } = require('@influxdata/influxdb-client')
const queryApi = new InfluxDB({ url: env.INFLUX_URL, token: env.INFLUX_TOKEN }).getQueryApi(env.INFLUX_ORG)

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')

const socketIo = require('socket.io')
const server = http.createServer(app)

// Websocket module
const EDUKIT_ID = 'UVC-EDU-01'

const io = socketIo(server, {
  cors: {
    origin: '*', // Allow requests from any domain
    methods: ['GET', 'POST']
  }
})

io.on('connection', (socket) => {
  const clientIp = socket.request.connection.remoteAddress

  console.log(`A user connected: ${socket.id}, IP: ${clientIp}`)

  socket.on('joinRoom', (edukitId) => {
    console.log(`Joining room: ${edukitId}, Socket ID: ${socket.id}`)
    socket.join(edukitId)
  })

  socket.on(`SEND${EDUKIT_ID}`, (msg) => {
    console.log(`Received Message from ${socket.id}: ${msg}`)
    // io.to(`SEND${EDUKIT_ID}`).emit(msg);
    io.to(EDUKIT_ID).emit(`SEND${EDUKIT_ID}`, msg)
  })

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`)
    // Optionally handle automatic leaving of rooms here if needed
  })
})

server.listen(8282, () => {
  console.log('Socket.IO server running at http://localhost:8282/')
})

// Traum BE module
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Traum BE is working now')
})

app.get('/influx/sensor/topic/list', async (req, res) => {
  const query = 'import "regexp"\n\n  from(bucket: "test_bucket")\n  |> range(start: -10d, stop: now())\n  |> filter(fn: (r) => (r["_measurement"] == "sensor_data"))\n  |> keep(columns: ["sensor_id"])\n  |> group()\n  |> distinct(column: "sensor_id")\n  |> limit(n: 1000)\n  |> sort()'

  const result = (await queryApi.collectRows(query)).map((r) => {
    return r._value.replace('edge/sensor/', '')
  })

  res.json(result)
})

app.get('/influx/sensor/topic/field/:sensorId', async (req, res) => {
  const sensorId = req.params.sensorId

  const query = `import "regexp"\n\n  from(bucket: "test_bucket")\n  |> range(start: -24h, stop: now())\n  |> filter(fn: (r) => (r["_measurement"] == "sensor_data") and (r["sensor_id"] == "edge/sensor/${sensorId}"))\n  |> keep(columns: ["_field"])\n  |> group()\n  |> distinct(column: "_field")\n  |> limit(n: 1000)\n  |> sort()`
  const result = (await queryApi.collectRows(query)).map((r) => {
    return r._value
  })

  res.json(result)
})

app.get('/influx/sensor/topic/history/:sensorId', async (req, res) => {
  const elapsed = req.query.elapsed ?? '24h'
  const sensorId = req.params.sensorId

  const query = `from(bucket: "test_bucket") |> range(start: -${elapsed}, stop: now()) |> filter(fn: (r) => r["_measurement"] == "sensor_data") |> filter(fn: (r) => r["sensor_id"] == "edge/sensor/${sensorId}")`

  const result = (await queryApi.collectRows(query))
    .filter((r) => r._field !== 'DataTime')
    .map((r) => {
      return {
        [r._field]: r._value,
        time: r._time
      }
    })

  res.json(result)
})

app.get('/influx/sensor/topic/history/:sensorId/:field', async (req, res) => {
  const elapsed = req.query.elapsed ?? '24h'
  const sensorId = req.params.sensorId
  const field = req.params.field

  const query = `from(bucket: "test_bucket") 
    |> range(start: -${elapsed}, stop: now())   
    |> filter(fn: (r) => r["_measurement"] == "sensor_data")
    |> filter(fn: (r) => r["sensor_id"] == "edge/sensor/${sensorId}")
    |> filter(fn: (r) => r["_field"] == "${field}")`

  const result = (await queryApi.collectRows(query))
    .filter((r) => r._field !== 'DataTime')
    .map((r) => {
      return {
        [r._field]: r._value,
        time: r._time
      }
    })

  res.json(result)
})

app.get('/sensor/object/list', async (req, res) => {
  const result = await prisma.sensor.findMany()

  res.json(result)
})

app.put('/sensor/object/:sensorId', async (req, res) => {
  const sensorId = req.params.sensorId
  const payload = req.body
  const result = await prisma.sensor.update({
    where: {
      id: Number(sensorId)
    },

    data: {
      glb_file_name: payload.glb_file_name,
      location: payload.location,
      threshold: Number(payload.threshold),
      mqttTopic: payload.mqttTopic
    }
  })

  res.json({
    ...result
  })
})

app.listen(3001, () => {
  console.log('Traum BE is now listening')
})
