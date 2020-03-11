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
  //   authHost: 'http://localhost:81',
  localTesting: true
})

console.log(agentLib)
