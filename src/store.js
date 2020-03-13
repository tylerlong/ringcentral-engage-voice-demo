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
      console.log(extensionInfo)
    } catch (e) { // We don't have a valid RC token
      if (e.data && (e.data.errors || []).some(error => /\btoken\b/i.test(error.message))) { // invalid token
        await localforage.clear()
        window.location.reload(false)
      }
    }
    // OK, we have a valid RC token
    agentLib.authenticateAgentWithRcAccessToken(rc.token().access_token, 'Bearer', authenticateRequest => {
      console.log(authenticateRequest)
      agentLib.openSocket(authenticateRequest.agents[0].agentId, (...args) => {
        console.log('openSocket', args)
      })
      agentLib.loginAgent(extensionInfo.extensionNumber, null/* queue ids */, null, null/* skill profile id */, null, false, true, (...args) => {
        console.log('loginAgent', args)
      })
    })
  },
  makeOutboundCall (calleeNumber) {
    console.log('before call', calleeNumber)
    agentLib.manualOutdial(calleeNumber, '6506849704', 60, 'USA', '72257')
    console.log('after call', calleeNumber)
  }
})

SubX.autoRun(store, async () => {
  if (store.token) {
    await localforage.setItem('token', store.token.toJSON())
  }
})

export default store
