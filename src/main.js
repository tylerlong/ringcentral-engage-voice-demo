import React from 'react'
import { Component } from 'react-subx'
import * as R from 'ramda'
import { Spin, Button, Input, Divider } from 'antd'

class App extends Component {
  render () {
    const store = this.props.store
    return (
      <>
        <h1>RingCentral Engage Voice Demo</h1>
        {store.ready ? <Main store={store} /> : <Spin size='large' />}
      </>
    )
  }
}

class Main extends Component {
  render () {
    const store = this.props.store
    return R.isNil(store.token) ? <Login store={store} /> : <Home store={store} />
  }
}

class Login extends Component {
  render () {
    const store = this.props.store
    return <a href={store.authorizeUri}><Button>Login Glip</Button></a>
  }
}

class Home extends Component {
  constructor (props) {
    super(props)
    this.state = { calleeNumber: undefined }
  }

  render () {
    const store = this.props.store
    return (
      <>
        <Input type='number' placeholder='6508888888' onChange={e => this.setState({ calleeNumber: e.target.value })} />
        <Divider />
        <Button block type='primary' onClick={() => { store.makeOutboundCall(this.state.calleeNumber) }}>Call</Button>
      </>
    )
  }
}

export default App
