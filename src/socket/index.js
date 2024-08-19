// const { io } = require('socket.io-client')
// const logger = require('@logger')
// const { fnUpdatePollingTime } = require('../barix')

// exports.connectIO = () => {
//   const socket = io.connect('http://127.0.0.1:3000/barix', {
//     // secure: true,
//     withCredentials: true,
//     rejectUnauthorized: false,
//     autoConnect: true
//   })

//   socket.on('connect', () => {
//     logger.info('Socket.io connected')
//   })

//   socket.on('connect_error', (err) => {
//     logger.error('Socket.io connect_error', err)
//   })

//   socket.on('error', (error) => {
//     logger.error(`Socket.io error: ${error}`)
//   })

//   socket.on('disconnect', () => {
//     logger.info('Socket.io disconnected')
//   })

//   socket.on('polling', (data) => {
//     fnUpdatePollingTime(data.polling)
//   })

//   //return
//   exports.socket = socket
// }
