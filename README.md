# RingCentral Engage Voice Demo

## Setup

### Install dependencies

```
yarn install
```

Engage Voice SDK will be public very soon.

For now, you need to copy its souce code to `./agent-library/`.

In the future, you should be able to install it via NPM. By then you should remove direct dependent of "sip.js".


### JS module loading issue

For some unknown reason, the AgentLibrary package doesn't work with this project's setup.

The workaround is to edit the `./agent-library/dist/agentLibrary.js`, and replace the last paragraph with:

```js
module.exports = initAgentLibrary(this);
```


### Configure dotenv

Copy `.env.sample` to `.env`.

Edit `.env` and specify credentials.


## Run

```
yarn dev
```

Check [http://localhost:8080/](http://localhost:8080/).


## Release

```
yarn release
```

The output files will be generated in `./docs` folder and be hosted by GitHub Pages: https://chuntaoliu.com/ringcentral-engage-voice-demo/.
