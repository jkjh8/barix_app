/** @format */

require('module-alias/register')
require('dotenv').config()
require('@db')
try {
  require('@socket').connectIO()
  require('./src/barix').fnStartPolling()
} catch (error) {
  console.error(error)
}
