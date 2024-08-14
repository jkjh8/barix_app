/** @format */

const path = require('node:path')
const logger = require('@logger')
const { logInfo, logError, logWarn } = require('./logs')
const { Worker } = require('worker_threads')
// db
const Barix = require('@db/models/barix')

const fnGetBarix = (device) => {
  try {
    const worker = new Worker(path.join(__dirname, 'worker.js'), {
      workerData: device.ipaddress
    })
    // 메시지 수신
    worker.on('message', (data) => {
      try {
        if (data.status) {
          Barix.updateOne(
            { ipaddress: device.ipaddress },
            { ...data, reconnect: 0 }
          )
          // 상태 변경 로그
          if (device.status === false) {
            logInfo(`Barix 연결 ${device.ipaddress}`, 'BARIX')
          }
        } else {
          Barix.updateOne(
            { ipaddress: device.ipaddress },
            { status: false, reconnect: device.reconnect + 1 }
          )
          // 연결 실패 로그
          if (device.status === true) {
            logError(`Barix 연결 오류 ${device.ipaddress}`, 'BARIX')
          }
        }
      } catch (error) {
        console.error(`Barix 데이터 저장 오류: ${error}`)
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
        logger.warn(
          `Barix 정보 수집 비정상 종료 ${device.ipaddress} ${code}`,
          'BARIX'
        )
      }
    })
  } catch (error) {
    logError(`Barix 데이터 수집 오류: ${error}`)
  }
}

module.exports = {
  fnGetBarix
}
