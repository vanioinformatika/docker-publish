/* eslint-env mocha */
const assert = require('chai').assert
const shell = require('shelljs')
const project = {
  'name': 'docker-publish',
  'config': {
    'docker': {
      'ns': 'mycompanynamespace',
      'url': 'docker.mycompany.org:5000',
      'name': null
    }
  }
}

const projectMyApp = {
  'name': 'docker-publish',
  'config': {
    'docker': {
      'ns': 'mycompanynamespace',
      'url': 'docker.mycompany.org:5000',
      'name': 'myapp'
    }
  }
}

const projectWithoutConfig = {
  'name': 'docker-publish'
}

describe('git tag is', function () {
  describe('on the last commit (npm version) and', function () {
    describe('configuration from package.json', function () {
      it('without docker.name', function () {
        const dockerPublish = require('../docker-publish.js')(shell, project, '1.2.3', '1.2.3', '3ab2ff5')
        let cmdQueue = dockerPublish.getCommandQueue()
        // release state
        // tag
        assert.match(cmdQueue[0], /^docker tag mycompanynamespace\/docker-publish:latest docker\.mycompany\.org:5000\/mycompanynamespace\/docker-publish:[\d]{1,}$/)
        assert.match(cmdQueue[1], /^docker tag mycompanynamespace\/docker-publish:latest docker\.mycompany\.org:5000\/mycompanynamespace\/docker-publish:[\d]{1,}\.[\d]{1,}$/)
        assert.match(cmdQueue[2], /^docker tag mycompanynamespace\/docker-publish:latest docker\.mycompany\.org:5000\/mycompanynamespace\/docker-publish:[\d]{1,}\.[\d]{1,}\.[\d]{1,}$/)
        assert.match(cmdQueue[3], /^docker tag mycompanynamespace\/docker-publish:latest docker\.mycompany\.org:5000\/mycompanynamespace\/docker-publish:[\d]{1,}\.[\d]{1,}\.[\d]{1,}-RELEASE-g[0-9a-f]{7}$/)
        assert.match(cmdQueue[4], /^docker tag mycompanynamespace\/docker-publish:latest docker\.mycompany\.org:5000\/mycompanynamespace\/docker-publish:latest$/)
        // push
        assert.match(cmdQueue[5], /^docker push docker\.mycompany\.org:5000\/mycompanynamespace\/docker-publish:[\d]{1,}$/)
        assert.match(cmdQueue[6], /^docker push docker\.mycompany\.org:5000\/mycompanynamespace\/docker-publish:[\d]{1,}\.[\d]{1,}$/)
        assert.match(cmdQueue[7], /^docker push docker\.mycompany\.org:5000\/mycompanynamespace\/docker-publish:[\d]{1,}\.[\d]{1,}\.[\d]{1,}$/)
        assert.match(cmdQueue[8], /^docker push docker\.mycompany\.org:5000\/mycompanynamespace\/docker-publish:[\d]{1,}\.[\d]{1,}\.[\d]{1,}-RELEASE-g[0-9a-f]{7}$/)
        assert.match(cmdQueue[9], /^docker push docker\.mycompany\.org:5000\/mycompanynamespace\/docker-publish:latest$/)
      })
      it('with docker.name="myapp"', function () {
        const dockerPublish = require('../docker-publish.js')(shell, projectMyApp, '1.2.3', '1.2.3', '3ab2ff5')
        let cmdQueue = dockerPublish.getCommandQueue()
        // release state
        // tag
        assert.match(cmdQueue[0], /^docker tag mycompanynamespace\/myapp:latest docker\.mycompany\.org:5000\/mycompanynamespace\/myapp:[\d]{1,}$/)
        assert.match(cmdQueue[1], /^docker tag mycompanynamespace\/myapp:latest docker\.mycompany\.org:5000\/mycompanynamespace\/myapp:[\d]{1,}\.[\d]{1,}$/)
        assert.match(cmdQueue[2], /^docker tag mycompanynamespace\/myapp:latest docker\.mycompany\.org:5000\/mycompanynamespace\/myapp:[\d]{1,}\.[\d]{1,}\.[\d]{1,}$/)
        assert.match(cmdQueue[3], /^docker tag mycompanynamespace\/myapp:latest docker\.mycompany\.org:5000\/mycompanynamespace\/myapp:[\d]{1,}\.[\d]{1,}\.[\d]{1,}-RELEASE-g[0-9a-f]{7}$/)
        assert.match(cmdQueue[4], /^docker tag mycompanynamespace\/myapp:latest docker\.mycompany\.org:5000\/mycompanynamespace\/myapp:latest$/)
        // push
        assert.match(cmdQueue[5], /^docker push docker\.mycompany\.org:5000\/mycompanynamespace\/myapp:[\d]{1,}$/)
        assert.match(cmdQueue[6], /^docker push docker\.mycompany\.org:5000\/mycompanynamespace\/myapp:[\d]{1,}\.[\d]{1,}$/)
        assert.match(cmdQueue[7], /^docker push docker\.mycompany\.org:5000\/mycompanynamespace\/myapp:[\d]{1,}\.[\d]{1,}\.[\d]{1,}$/)
        assert.match(cmdQueue[8], /^docker push docker\.mycompany\.org:5000\/mycompanynamespace\/myapp:[\d]{1,}\.[\d]{1,}\.[\d]{1,}-RELEASE-g[0-9a-f]{7}$/)
        assert.match(cmdQueue[9], /^docker push docker\.mycompany\.org:5000\/mycompanynamespace\/myapp:latest$/)
      })
    })
    it('no configuration', function () {
      const dockerPublish = require('../docker-publish.js')(shell, projectWithoutConfig, '1.2.3', '1.2.3', '3ab2ff5')
      let cmdQueue = dockerPublish.getCommandQueue()
        // release state
        // tag
      assert.match(cmdQueue[0], /^docker tag docker-publish:latest docker-publish:[\d]{1,}$/)
      assert.match(cmdQueue[1], /^docker tag docker-publish:latest docker-publish:[\d]{1,}\.[\d]{1,}$/)
      assert.match(cmdQueue[2], /^docker tag docker-publish:latest docker-publish:[\d]{1,}\.[\d]{1,}\.[\d]{1,}$/)
      assert.match(cmdQueue[3], /^docker tag docker-publish:latest docker-publish:[\d]{1,}\.[\d]{1,}\.[\d]{1,}-RELEASE-g[0-9a-f]{7}$/)
      assert.match(cmdQueue[4], /^docker tag docker-publish:latest docker-publish:latest$/)
        // push
      assert.match(cmdQueue[5], /^docker push docker-publish:[\d]{1,}$/)
      assert.match(cmdQueue[6], /^docker push docker-publish:[\d]{1,}\.[\d]{1,}$/)
      assert.match(cmdQueue[7], /^docker push docker-publish:[\d]{1,}\.[\d]{1,}\.[\d]{1,}$/)
      assert.match(cmdQueue[8], /^docker push docker-publish:[\d]{1,}\.[\d]{1,}\.[\d]{1,}-RELEASE-g[0-9a-f]{7}$/)
      assert.match(cmdQueue[9], /^docker push docker-publish:latest$/)
    })
    it('DOCKER_NAME configuration comes from env variable', function () {
      process.env.DOCKER_NAME = 'myawesomeapp'
      const dockerPublish = require('../docker-publish.js')(shell, projectWithoutConfig, '1.2.3', '1.2.3', '3ab2ff5')
      let cmdQueue = dockerPublish.getCommandQueue()
        // release state
        // tag
      assert.match(cmdQueue[0], /^docker tag myawesomeapp:latest myawesomeapp:[\d]{1,}$/)
      assert.match(cmdQueue[1], /^docker tag myawesomeapp:latest myawesomeapp:[\d]{1,}\.[\d]{1,}$/)
      assert.match(cmdQueue[2], /^docker tag myawesomeapp:latest myawesomeapp:[\d]{1,}\.[\d]{1,}\.[\d]{1,}$/)
      assert.match(cmdQueue[3], /^docker tag myawesomeapp:latest myawesomeapp:[\d]{1,}\.[\d]{1,}\.[\d]{1,}-RELEASE-g[0-9a-f]{7}$/)
      assert.match(cmdQueue[4], /^docker tag myawesomeapp:latest myawesomeapp:latest$/)
        // push
      assert.match(cmdQueue[5], /^docker push myawesomeapp:[\d]{1,}$/)
      assert.match(cmdQueue[6], /^docker push myawesomeapp:[\d]{1,}\.[\d]{1,}$/)
      assert.match(cmdQueue[7], /^docker push myawesomeapp:[\d]{1,}\.[\d]{1,}\.[\d]{1,}$/)
      assert.match(cmdQueue[8], /^docker push myawesomeapp:[\d]{1,}\.[\d]{1,}\.[\d]{1,}-RELEASE-g[0-9a-f]{7}$/)
      assert.match(cmdQueue[9], /^docker push myawesomeapp:latest$/)
      delete process.env.DOCKER_NAME
    })
    it('DOCKER_NS configuration comes from env variable', function () {
      process.env.DOCKER_NS = 'namespace'
      const dockerPublish = require('../docker-publish.js')(shell, projectWithoutConfig, '1.2.3', '1.2.3', '3ab2ff5')
      let cmdQueue = dockerPublish.getCommandQueue()
        // release state
        // tag
      assert.match(cmdQueue[0], /^docker tag namespace\/docker-publish:latest namespace\/docker-publish:[\d]{1,}$/)
      assert.match(cmdQueue[1], /^docker tag namespace\/docker-publish:latest namespace\/docker-publish:[\d]{1,}\.[\d]{1,}$/)
      assert.match(cmdQueue[2], /^docker tag namespace\/docker-publish:latest namespace\/docker-publish:[\d]{1,}\.[\d]{1,}\.[\d]{1,}$/)
      assert.match(cmdQueue[3], /^docker tag namespace\/docker-publish:latest namespace\/docker-publish:[\d]{1,}\.[\d]{1,}\.[\d]{1,}-RELEASE-g[0-9a-f]{7}$/)
      assert.match(cmdQueue[4], /^docker tag namespace\/docker-publish:latest namespace\/docker-publish:latest$/)
        // push
      assert.match(cmdQueue[5], /^docker push namespace\/docker-publish:[\d]{1,}$/)
      assert.match(cmdQueue[6], /^docker push namespace\/docker-publish:[\d]{1,}\.[\d]{1,}$/)
      assert.match(cmdQueue[7], /^docker push namespace\/docker-publish:[\d]{1,}\.[\d]{1,}\.[\d]{1,}$/)
      assert.match(cmdQueue[8], /^docker push namespace\/docker-publish:[\d]{1,}\.[\d]{1,}\.[\d]{1,}-RELEASE-g[0-9a-f]{7}$/)
      assert.match(cmdQueue[9], /^docker push namespace\/docker-publish:latest$/)
      delete process.env.DOCKER_NS
    })
    it('DOCKER_URL configuration comes from env variable', function () {
      process.env.DOCKER_URL = 'newdocker.newmycompany.org:5000'
      const dockerPublish = require('../docker-publish.js')(shell, projectWithoutConfig, '1.2.3', '1.2.3', '3ab2ff5')
      let cmdQueue = dockerPublish.getCommandQueue()
      // release state
      // tag
      assert.match(cmdQueue[0], /^docker tag docker-publish:latest newdocker\.newmycompany\.org:5000\/docker-publish:[\d]{1,}$/)
      assert.match(cmdQueue[1], /^docker tag docker-publish:latest newdocker\.newmycompany\.org:5000\/docker-publish:[\d]{1,}\.[\d]{1,}$/)
      assert.match(cmdQueue[2], /^docker tag docker-publish:latest newdocker\.newmycompany\.org:5000\/docker-publish:[\d]{1,}\.[\d]{1,}\.[\d]{1,}$/)
      assert.match(cmdQueue[3], /^docker tag docker-publish:latest newdocker\.newmycompany\.org:5000\/docker-publish:[\d]{1,}\.[\d]{1,}\.[\d]{1,}-RELEASE-g[0-9a-f]{7}$/)
      assert.match(cmdQueue[4], /^docker tag docker-publish:latest newdocker\.newmycompany\.org:5000\/docker-publish:latest$/)
      // push
      assert.match(cmdQueue[5], /^docker push newdocker\.newmycompany\.org:5000\/docker-publish:[\d]{1,}$/)
      assert.match(cmdQueue[6], /^docker push newdocker\.newmycompany\.org:5000\/docker-publish:[\d]{1,}\.[\d]{1,}$/)
      assert.match(cmdQueue[7], /^docker push newdocker\.newmycompany\.org:5000\/docker-publish:[\d]{1,}\.[\d]{1,}\.[\d]{1,}$/)
      assert.match(cmdQueue[8], /^docker push newdocker\.newmycompany\.org:5000\/docker-publish:[\d]{1,}\.[\d]{1,}\.[\d]{1,}-RELEASE-g[0-9a-f]{7}$/)
      assert.match(cmdQueue[9], /^docker push newdocker\.newmycompany\.org:5000\/docker-publish:latest$/)
      delete process.env.DOCKER_URL
    })
  })
  describe('not on the last commit (commit/push) and', function () {
    describe('configuration from package.json', function () {
      it('without docker.name', function () {
        const dockerPublish = require('../docker-publish.js')(shell, project, '1.2.3-1-ge2fd8c1', '1.2.3', 'e2fdc1')
        let cmdQueue = dockerPublish.getCommandQueue()
        assert.match(cmdQueue[0], /^docker tag mycompanynamespace\/docker-publish:latest docker\.mycompany\.org:5000\/mycompanynamespace\/docker-publish:[\d]{1,}\.[\d]{1,}\.[\d]{1,}-[\d]{1,}-g[0-9a-f]{7}$/)
        assert.match(cmdQueue[1], /^docker push docker\.mycompany\.org:5000\/mycompanynamespace\/docker-publish:[\d]{1,}\.[\d]{1,}\.[\d]{1,}-[\d]{1,}-g[0-9a-f]{7}$/)
      })
      it('with docker.name="myapp"', function () {
        const dockerPublish = require('../docker-publish.js')(shell, projectMyApp, '1.2.3-1-ge2fd8c1', '1.2.3', 'e2fdc1')
        let cmdQueue = dockerPublish.getCommandQueue()
        assert.match(cmdQueue[0], /^docker tag mycompanynamespace\/myapp:latest docker\.mycompany\.org:5000\/mycompanynamespace\/myapp:[\d]{1,}\.[\d]{1,}\.[\d]{1,}-[\d]{1,}-g[0-9a-f]{7}$/)
        assert.match(cmdQueue[1], /^docker push docker\.mycompany\.org:5000\/mycompanynamespace\/myapp:[\d]{1,}\.[\d]{1,}\.[\d]{1,}-[\d]{1,}-g[0-9a-f]{7}$/)
      })
    })
    it('no configuration', function () {
      const dockerPublish = require('../docker-publish.js')(shell, projectWithoutConfig, '1.2.3-1-ge2fd8c1', '1.2.3', 'e2fdc1')
      let cmdQueue = dockerPublish.getCommandQueue()
      assert.match(cmdQueue[0], /^docker tag docker-publish:latest docker-publish:[\d]{1,}\.[\d]{1,}\.[\d]{1,}-[\d]{1,}-g[0-9a-f]{7}$/)
      assert.match(cmdQueue[1], /^docker push docker-publish:[\d]{1,}\.[\d]{1,}\.[\d]{1,}-[\d]{1,}-g[0-9a-f]{7}$/)
    })
    it('DOCKER_NAME configuration comes from env variable', function () {
      process.env.DOCKER_NAME = 'myawesomeapp'
      const dockerPublish = require('../docker-publish.js')(shell, projectWithoutConfig, '1.2.3-1-ge2fd8c1', '1.2.3', 'e2fdc1')
      let cmdQueue = dockerPublish.getCommandQueue()
      assert.match(cmdQueue[0], /^docker tag myawesomeapp:latest myawesomeapp:[\d]{1,}\.[\d]{1,}\.[\d]{1,}-[\d]{1,}-g[0-9a-f]{7}$/)
      assert.match(cmdQueue[1], /^docker push myawesomeapp:[\d]{1,}\.[\d]{1,}\.[\d]{1,}-[\d]{1,}-g[0-9a-f]{7}$/)
      delete process.env.DOCKER_NAME
    })
    it('DOCKER_NS configuration comes from env variable', function () {
      process.env.DOCKER_NS = 'mynamespace'
      const dockerPublish = require('../docker-publish.js')(shell, projectWithoutConfig, '1.2.3-1-ge2fd8c1', '1.2.3', 'e2fdc1')
      let cmdQueue = dockerPublish.getCommandQueue()
      assert.match(cmdQueue[0], /^docker tag mynamespace\/docker-publish:latest mynamespace\/docker-publish:[\d]{1,}\.[\d]{1,}\.[\d]{1,}-[\d]{1,}-g[0-9a-f]{7}$/)
      assert.match(cmdQueue[1], /^docker push mynamespace\/docker-publish:[\d]{1,}\.[\d]{1,}\.[\d]{1,}-[\d]{1,}-g[0-9a-f]{7}$/)
      delete process.env.DOCKER_NS
    })
    it('DOCKER_URL configuration comes from env variable', function () {
      process.env.DOCKER_URL = 'newdocker.newmycompany.org:5000'
      const dockerPublish = require('../docker-publish.js')(shell, projectWithoutConfig, '1.2.3-1-ge2fd8c1', '1.2.3', 'e2fdc1')
      let cmdQueue = dockerPublish.getCommandQueue()
      assert.match(cmdQueue[0], /^docker tag docker-publish:latest newdocker.newmycompany.org:5000\/docker-publish:[\d]{1,}\.[\d]{1,}\.[\d]{1,}-[\d]{1,}-g[0-9a-f]{7}$/)
      assert.match(cmdQueue[1], /^docker push newdocker.newmycompany.org:5000\/docker-publish:[\d]{1,}\.[\d]{1,}\.[\d]{1,}-[\d]{1,}-g[0-9a-f]{7}$/)
      delete process.env.DOCKER_URL
    })
  })
})
