import RingCentral from 'ringcentral-js-concise'
import localforage from 'localforage'
import SubX from 'subx'
import * as R from 'ramda'

import agentLib from './agentLib'

const redirectUri = window.location.origin + window.location.pathname
const urlSearchParams = new URLSearchParams(new URL(window.location.href).search)
const rc = new RingCentral(process.env.RINGCENTRAL_CLIENT_ID, process.env.RINGCENTRAL_CLIENT_SECRET, RingCentral.PRODUCTION_SERVER)

const store = SubX.create({
  ready: false,
  token: undefined,
  callerNumber: undefined,
  queueId: undefined,
  authorizeUri: rc.authorizeUri(redirectUri, { state: urlSearchParams.toString() }),
  async init () {
    rc.on('tokenChanged', token => {
      this.token = token
    })
    const code = urlSearchParams.get('code')
    if (code) {
      await rc.authorize({ code, redirectUri })
      await localforage.setItem('token', rc.token())
    }
  },
  async load () {
    rc.token(await localforage.getItem('token'))
    if (R.isNil(rc.token())) {
      return
    }
    let extensionInfo
    try {
      const r = await rc.get('/restapi/v1.0/account/~/extension/~')
      extensionInfo = r.data
      console.log('extensionInfo')
      console.log(JSON.stringify(extensionInfo, null, 2))
    } catch (e) { // We don't have a valid RC token
      if (e.data && (e.data.errors || []).some(error => /\btoken\b/i.test(error.message))) { // invalid token
        await localforage.clear()
        window.location.reload(false)
      }
    }
    // OK, we have a valid RC token
    const r2 = await rc.get('/restapi/v1.0/account/~/extension/~/phone-number')
    this.callerNumber = r2.data.records.filter(phoneNumber => R.includes('CallerId', phoneNumber.features))[0].phoneNumber
    agentLib.authenticateAgentWithRcAccessToken(rc.token().access_token, 'Bearer', authenticateRequest => {
      console.log(JSON.stringify(authenticateRequest, null, 2))
      agentLib.openSocket(authenticateRequest.agents[0].agentId, (...args) => {
        console.log('openSocket')
        console.log(JSON.stringify(args, null, 2))
      })
      const callbackBackup = agentLib.getCallback('loginPhase1Response')
      agentLib.setCallback('loginPhase1Response', loginPhase1Response => {
        agentLib.setCallback('loginPhase1Response', callbackBackup)
        console.log('loginPhase1Response')
        console.log(JSON.stringify(loginPhase1Response, null, 2))
        const availableQueues = loginPhase1Response.inboundSettings.availableQueues
        this.queueId = availableQueues[0].gateId
        const availableSkillProfiles = loginPhase1Response.inboundSettings.availableSkillProfiles
        agentLib.loginAgent('RC_SOFTPHONE', availableQueues.map(aq => aq.gateId), null, availableSkillProfiles.map(as => as.profileId), null, false, true, (...args) => {
          console.log('loginAgent')
          console.log(JSON.stringify(args, null, 2))
          agentLib.setCallback('sipRegisteredCallback', (...args) => {
            console.log('sipRegisteredCallback')
            console.log(JSON.stringify(args, null, 2))
          })
          agentLib.sipInit()
          agentLib.sipRegister()
        })
      })
    })
  },
  makeOutboundCall (calleeNumber) {
    agentLib.manualOutdial(calleeNumber, this.callerNumber, 60, 'USA', this.queueId)
  }
})

SubX.autoRun(store, async () => {
  if (store.token) {
    await localforage.setItem('token', store.token.toJSON())
  }
})

export default store
