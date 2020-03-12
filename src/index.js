global.SIP = require('sip.js')
const AgentLibrary = require('../agent-library/dist/agentLibrary.js')

const allCallbacks = [
  'addSessionNotification',
  'agentStateResponse',
  'acknowledgeResponse',
  'bargeInResponse',
  'closeResponse',
  'coachResponse',
  'configureResponse',
  'callNotesResponse',
  'callbacksPendingResponse',
  'callbackCancelResponse',
  'campaignDispositionsResponse',
  'chatResponse',
  'dialGroupChangeNotification',
  'dialGroupChangePendingNotification',
  'dropSessionNotification',
  'earlyUiiNotification',
  'endCallNotification',
  'gatesChangeNotification',
  'genericNotification',
  'genericResponse',
  'holdResponse',
  'leadSearchResponse',
  'loginResponse',
  'logoutResponse',
  'monitorResponse',
  'newCallNotification',
  'offhookInitResponse',
  'offhookTermNotification',
  'openResponse',
  'pauseRecordResponse',
  'pendingDispNotification',
  'previewFetchResponse',
  'previewLeadStateNotification',
  'recordResponse',
  'requeueResponse',
  'reverseMatchNotification',
  'safeModeFetchResponse',
  'safeModeSearchResponse',
  'scriptConfigResponse',
  'supervisorListResponse',
  'coldXferResponse',
  'warmXferResponse',
  'agentStats',
  'agentDailyStats',
  'campaignStats',
  'queueStats',
  'chatQueueStats'
]

const callbacks = {}
for (const key of allCallbacks) {
  callbacks[key] = (...args) => {
    console.log(key, args)
  }
}

const agentLib = new AgentLibrary({
  callbacks,
  authHost: 'https://engage.ringcentral.com',
  localTesting: true
})

// agentId=1364029
// platformId=aws82
// rcUserId=3058829020
// agentLib.authenticateAgentWithUsernamePassword('xxxxxxx@gmail.com', 'xxxxxxx', 'aws82', (...args) => {
//   console.log('authenticateAgentWithUsernamePassword', args) // cannot make it work, invalid password
// })

agentLib.authenticateAgentWithRcAccessToken(process.env.RINGCENTRAL_ACCESS_TOKEN, 'Bearer', (...args) => {
  console.log('authenticateAgentWithRcAccessToken', args)
  agentLib.openSocket(process.env.ENGAGE_VOICE_AGENT_ID, (...args) => {
    console.log('openSocket', args)
  })
  agentLib.loginAgent(process.env.ENGAGE_VOICE_AGENT_EXTENSION_NUMBER, ['72257']/* queue ids */, null, ['214001']/* skill profile id */, null, false, true, (...args) => {
    console.log('loginAgent', args)
  })
})
