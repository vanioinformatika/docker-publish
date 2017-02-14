#!/usr/bin/env node

const debug = require('debug')('docker-publish')
const shell = require('shelljs')
const project = require('../../../../package.json')

debug(`DOCKER_SKIP: ${process.env.DOCKER_SKIP}, DOCKER_SILENCE: ${process.env.DOCKER_SILENCE}`)

// skip docker tagging and pushing, default: false
let dockerSkip = false
if (project.config && project.config.docker) {
  dockerSkip = process.env.DOCKER_SKIP || project.config.docker.skip || false
} else {
  dockerSkip = process.env.DOCKER_SKIP || false
}

// silence mode, default: false
let dockerSilence = false
if (project.config && project.config.docker) {
  dockerSilence = process.env.DOCKER_SILENCE || project.config.docker.silence || false
} else {
  dockerSilence = process.env.DOCKER_SILENCE || false
}

const options = {silent: true}
const tag = shell.exec('git describe --tags --always', options).replace(/(\r\n|\n|\r)/gm, '')
const strictTag = shell.exec('git describe --tags --always --abbrev=0', options).replace(/(\r\n|\n|\r)/gm, '')
const id = shell.exec('git rev-parse --short HEAD', options).replace(/(\r\n|\n|\r)/gm, '')

const dockerPublish = require('./docker-publish.js')(shell, project, tag, strictTag, id)

// execute commands
dockerPublish.getCommandQueue().forEach((cmd) => {
  if (!dockerSkip) {
    shell.exec(cmd, {silent: dockerSilence})
  } else {
    if (!dockerSilence) {
      console.log(`skipped: ${cmd}`)
    }
  }
})
