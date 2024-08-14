const cheerio = require('cheerio')
const axios = require('axios')

const Barix = require('@db/models/barix')

const logger = require('@logger')
const { logInfo, logError, logWarn } = require('@api/logs')

const fnGetBarix = (device) => {
  axios
    .get(`http://${device.ipaddress}/status2`, { timeout: 5000 })
    .then((html) => {
      const $ = cheerio.load(html.data)
      fnDbUpdate(device, {
        status: true,
        macaddress: $('#macaddress').text().trim(),
        gateway: $('#gateway').text().trim(),
        netmask: $('#netmask').text().trim(),
        hwtype: Number($('#hwtype').text().trim()),
        ipamtype: Number($('#ipamtype').text().trim()),
        codectype: Number($('#codectype').text().trim()),
        uptime: Number($('#uptime').text().trim()),
        volume: Number($('#volume').text().trim()),
        url1: $('#url1').text().trim(),
        url2: $('#url2').text().trim(),
        url3: $('#url3').text().trim(),
        shuffle: $('#shuffle').text().trim() === 'Off' ? false : true,
        repeat: $('#repeat').text().trim() === 'Off' ? false : true,
        buffer: $('#buffer').text().trim(),
        streamnumber: Number($('#streamnumber').text().trim()),
        streamurl: $('#streamurl').text().trim(),
        channels: Number($('#channels').text().trim()),
        birate: Number($('#birate').text().trim()),
        mediaformat: $('#mediaformat').text().trim(),
        rtpdelay: Number($('#rtpdelay').text().trim()),
        rtpdelayave: Number($('#rtpdelayave').text().trim()),
        // lasterror: $('#lasterror').text().trim(),
        relay1: Number($('#relay1').text().trim()),
        relay2: Number($('#relay2').text().trim()),
        relay3: Number($('#relay3').text().trim()),
        relay4: Number($('#relay4').text().trim()),
        relay5: Number($('#relay5').text().trim()),
        relay6: Number($('#relay6').text().trim()),
        relay7: Number($('#relay7').text().trim()),
        relay8: Number($('#relay8').text().trim()),
        serialgatewayip: $('#serialgatewayip').text().trim(),
        serialgatewayport: Number($('#serialgatewayport').text().trim()),
        serialgatewaymode: Number($('#serialgatewaymode').text().trim()),
        serialgatewaybaudrate: Number(
          $('#serialgatewaybaudrate').text().trim()
        ),
        serialgatewayflow: Number($('#serialgatewayflow').text().trim())
      })
    })
    .catch((error) => {
      fnDbUpdate(device, {
        status: false,
        reconnect: device.reconnect + 1
      })
      logError(`Barix 연결 오류 ${device.ipaddress} ${error}`, 'BARIX')
    })
}

const fnDbUpdate = (device, data) => {
  Barix.updateOne({ ipaddress: device.ipaddress }, { ...data, reconnect: 0 })
    .then((res) => {
      //
    })
    .catch((error) => {
      logError(`Barix 데이터 저장 오류: ${error}`)
    })
}

module.exports = {
  fnGetBarix,
  fnDbUpdate
}
