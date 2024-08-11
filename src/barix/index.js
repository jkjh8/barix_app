/** @format */
const axios = require('axios')
const https = require('https')
const logger = require('../logger')
const { fnGetBarix } = require('../api')

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
    console.log('Polling...')
  }, polling * 1000)
}

function fnUpdatePollingTime(seconds) {
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
    const { data } = await axios.get('http://127.0.0.1/api/barix', {
      headers: {
        authenticate: process.env.BARIX_PASS
      }
    })
    if (polling != data.polling) {
      fnUpdatePollingTime(data.polling)
    }
    barix = [...data.barix]
    // 바릭스 데이터 가져오기 시작
    barix.forEach((device) => {
      fnGetBarix(device)
    })
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
