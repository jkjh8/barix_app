/** @format */

const path = require('node:path')
const logger = require('@logger')
const { logInfo, logError, logWarn } = require('./logs')
const { Worker } = require('worker_threads')
// db
const Barix = require('@db/models/barix')

const fnGetBarix = async (device) => {
  try {
    const worker = new Worker(path.join(__dirname, 'worker.js'), {
      workerData: device.ipaddress
    })
    // 메시지 수신
    worker.on('message', async (data) => {
      if (data.status) {
        Barix.updateOne(
          { ipaddress: device.ipaddress },
          { ...data, status: true, reconnect: 0 }
        ).exec()
        // 상태 변경 로그
        if (device.status === false) {
          logInfo(`Barix 연결 ${device.ipaddress}`, 'BARIX')
        }
      } else {
        Barix.updateOne(
          { ipaddress: device.ipaddress },
          { status: false, reconnect: device.reconnect + 1 }
        ).exec()
        // 연결 실패 로그
        if (device.status === true) {
          logError(`Barix 연결 오류 ${device.ipaddress}`, 'BARIX')
        }
      }
      worker.terminate()
    })
    // 에러 발생시
    worker.on('error', (error) => {
      logError(`Barix 정보 수집 오류 ${error}`, 'BARIX')
    })
    // 종료시
    worker.on('exit', (code) => {
      if (code !== 1) {
        logError(`Barix 정보 수집 비정상 종료 ${code}`, 'BARIX')
      }
    })
  } catch (error) {
    logger.error(`fnGetBarix: ${error}`)
  }
}

module.exports = {
  fnGetBarix
}
