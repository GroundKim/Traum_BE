const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main () {
  await prisma.sensor.upsert({
    where: {
      sensor_name: 'temperature-1'
    },
    update: {},

    create: {
      sensor_name: 'temperature-1',
      location: '0, 0, 0',
      threshold: -1,

      mqttTopic: 'edge/sensor/temperature-1'
    }
  })

  await prisma.sensor.upsert({
    where: {
      sensor_name: 'temperature-2'
    },
    update: {},

    create: {
      sensor_name: 'temperature-2',
      location: '0, 0, 0',
      threshold: -1,

      mqttTopic: 'edge/sensor/temperature-2'
    }
  })

  await prisma.sensor.upsert({
    where: {
      sensor_name: 'temperature-3'
    },
    update: {},

    create: {
      sensor_name: 'temperature-3',
      location: '0, 0, 0',
      threshold: -1,

      mqttTopic: 'edge/sensor/temperature-3'
    }
  })

  await prisma.sensor.upsert({
    where: {
      sensor_name: 'CO2Concentration-1'
    },
    update: {},

    create: {
      sensor_name: 'CO2Concentration-1',
      location: '0, 0, 0',
      threshold: -1,

      mqttTopic: 'edge/sensor/CO2Concentration-1'
    }
  })

  await prisma.sensor.upsert({
    where: {
      sensor_name: 'CO2Concentration-2'
    },
    update: {},

    create: {
      sensor_name: 'CO2Concentration-2',
      location: '0, 0, 0',
      threshold: -1,

      mqttTopic: 'edge/sensor/CO2Concentration-2'
    }
  })

  await prisma.sensor.upsert({
    where: {
      sensor_name: 'CO2Concentration-3'
    },
    update: {},

    create: {
      sensor_name: 'CO2Concentration-3',
      location: '0, 0, 0',
      threshold: -1,

      mqttTopic: 'edge/sensor/CO2Concentration-3'
    }
  })

  await prisma.sensor.upsert({
    where: {
      sensor_name: 'soundLevel-1'
    },
    update: {},

    create: {
      sensor_name: 'soundLevel-1',
      location: '0, 0, 0',
      threshold: -1,

      mqttTopic: 'edge/sensor/soundLevel-1'
    }
  })

  await prisma.sensor.upsert({
    where: {
      sensor_name: 'soundLevel-2'
    },
    update: {},

    create: {
      sensor_name: 'soundLevel-2',
      location: '0, 0, 0',
      threshold: -1,

      mqttTopic: 'edge/sensor/soundLevel-2'
    }
  })

  await prisma.sensor.upsert({
    where: {
      sensor_name: 'soundLevel-3'
    },
    update: {},

    create: {
      sensor_name: 'soundLevel-3',
      location: '0, 0, 0',
      threshold: -1,

      mqttTopic: 'edge/sensor/soundLevel-3'
    }
  })
}

main()
  .then(async () => {
    console.log('scaffold finished')
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
