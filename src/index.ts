import dotenv from 'dotenv'
import * as fs from 'fs'
import tmi from 'tmi.js'

dotenv.config()

const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true,
  },

  ...(process.env.USER && process.env.PASSWORD
    ? {
        identity: {
          username: process.env.USER,
          password: process.env.PASSWORD,
        },
      }
    : {}),

  channels: process.env.CHANNELS?.split(','),
})

const start = async () => {
  console.log('Connecting to Twitch...')
  await client.connect()
  console.log('Connected to Twitch!')

  client.on('message', (channel, tags, message, self) => {
    const path = `output/${channel.replace('#', '')}.log`
    const timestamp = new Date().toISOString()

    fs.appendFileSync(path, `[${timestamp}] ${tags['display-name']}: ${message}\n`)
  })
}

start()
