/** @format */
const axios = require('axios')
const https = require('https')
const logger = require('../logger')
const { fnGetBarix } = require('../api/barix')
const socket = require('@socket')
const Barix = require('@db/models/barix')

let polling = 50
let interval = null
let barix = []

const agent = new https.Agent({
  rejectUnauthorized: false
})

function fnStartPolling() {
  logger.info(`바릭스 데이터 수집 시작: Polling every ${polling} seconds`)
  interval = setInterval(() => {
    fnGetBarixData()
  }, polling * 1000)
}

function fnUpdatePollingTime(seconds) {
  if (seconds) return
  if (typeof seconds !== 'number') return
  if (polling == seconds) return
  logger.info(
    `바릭스 데이터 수집 주기 변경: ${polling} seconds -> ${seconds} seconds`
  )
  polling = seconds
  clearInterval(interval)
  fnStartPolling()
}

// barix 데이터 가져오기
const fnGetBarixData = async () => {
  try {
    barix = await Barix.find()
    const { data } = await axios.get('http://127.0.0.1:3000/api/barix/polling')
    fnUpdatePollingTime(data.polling)
    barix.forEach((device) => fnGetBarix(device))
  } catch (error) {
    logger.error(`fnGetBarixData: ${error}`)
  }
}

module.exports = {
  barix,
  fnStartPolling,
  fnUpdatePollingTime,
  fnGetBarixData
}
