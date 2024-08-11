/** @format */

const { workerData, parentPort } = require('worker_threads')
const cheerio = require('cheerio')
const axios = require('axios')

const getHtml = async (ipaddress) => {
  axios
    .get(`http://${ipaddress}/status2`, { timeout: 5000 })
    .then((html) => {
      const $ = cheerio.load(html.data)
      parentPort.postMessage({
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
        lasterror: $('#lasterror').text().trim(),
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
    .catch((err) => {
      parentPort.postMessage({
        status: false,
        error: err.message
      })
    })
}

if (workerData) {
  getHtml(workerData)
}
