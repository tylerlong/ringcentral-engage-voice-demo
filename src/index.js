import React from 'react'
import ReactDOM from 'react-dom'
import AgentLibrary from '../agent-library/dist/agentLibrary.js'

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

agentLib.authenticateAgentWithRcAccessToken(process.env.RINGCENTRAL_ACCESS_TOKEN, 'Bearer', (...args) => {
  console.log('authenticateAgentWithRcAccessToken', args)
  agentLib.openSocket(process.env.ENGAGE_VOICE_AGENT_ID, (...args) => {
    console.log('openSocket', args)
  })
  agentLib.loginAgent(process.env.ENGAGE_VOICE_AGENT_EXTENSION_NUMBER, ['72257']/* queue ids */, null, ['214001']/* skill profile id */, null, false, true, (...args) => {
    console.log('loginAgent', args)
  })
})

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = { calleeNumber: undefined }
  }

  call () {
    console.log('before call', this.state.calleeNumber)
    agentLib.manualOutdial(this.state.calleeNumber, '6506849704', 60, 'USA', '72257')
    console.log('after call', this.state.calleeNumber)
  }

  render () {
    return (
      <>
        <button onClick={() => { this.call() }}>Call</button>
        <input type='number' placeholder='1234567890' onChange={e => this.setState({ calleeNumber: e.target.value })} />
      </>
    )
  }
}

const container = document.createElement('div')
document.body.appendChild(container)
ReactDOM.render(<App />, container)
