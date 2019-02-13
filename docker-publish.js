const debug = require('debug')('docker-publish')

module.exports = (shell, project, tag, strictTag, id) => {
  if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git')
    shell.exit(1)
  }

  debug(`git tag: ${strictTag}`)

  let dockerStrictSemver = false
  if (project.config && project.config.docker) {
    dockerStrictSemver = process.env.DOCKER_STRICT_SEMVER !== undefined ? process.env.DOCKER_STRICT_SEMVER : project.config.docker.strictSemver
    debug('given dockerStrictSemver: ' + dockerStrictSemver)
    if (dockerStrictSemver) {
      if (dockerStrictSemver === 'true' ||
        dockerStrictSemver === '1' ||
        dockerStrictSemver === '0' ||
        dockerStrictSemver === 'false') {
        dockerStrictSemver = dockerStrictSemver === '1' ? true : dockerStrictSemver
        dockerStrictSemver = dockerStrictSemver === 'true' ? true : dockerStrictSemver
        dockerStrictSemver = dockerStrictSemver === 'false' ? false : dockerStrictSemver
        dockerStrictSemver = dockerStrictSemver === '0' ? false : dockerStrictSemver
      } else {
        // invalid dockerStrictSemver value
        throw new Error('invalid dockerStrictSemver value, valid values is true, false, 0, 1, given: ' + dockerStrictSemver)
      }
    } else {
      dockerStrictSemver = false
    }
  }
  debug('set dockerStrictSemver: ' + dockerStrictSemver)
  const versionNumberArray = tag.split('.')
  let tagList = []
  if (strictTag === tag) {
    // release: npm version
    if (dockerStrictSemver) {
      tagList.push(strictTag)
    } else {
      tagList.push(versionNumberArray[0])
      tagList.push(`${versionNumberArray[0]}.${versionNumberArray[1]}`)
      tagList.push(strictTag)
      tagList.push(`${strictTag}-RELEASE-${'g' + id}`)
      tagList.push('latest')
    }
  } else {
    if (dockerStrictSemver) {
      throw new Error('If strictSemver/DOCKER_STRICT_SEMVER is true, then snapshot is not available, see more in README.')
    }
    // commit/push
    tagList.push(tag)
  }
  debug(`creating docker tag: ${tagList}`)

  let dockerNS
  let dockerURL
  let dockerName
  // variable precedency
  if (project.config && project.config.docker) {
    dockerNS = process.env.DOCKER_NS !== undefined ? process.env.DOCKER_NS : project.config.docker.ns
    dockerURL = process.env.DOCKER_URL !== undefined ? process.env.DOCKER_URL : project.config.docker.url
    dockerName = process.env.DOCKER_NAME || project.config.docker.name || project.name
  } else {
    dockerNS = process.env.DOCKER_NS
    dockerURL = process.env.DOCKER_URL
    dockerName = process.env.DOCKER_NAME || project.name
  }
  // config
  debug(`process.env contains: dockerNS: ${process.env.DOCKER_NS}, dockerURL: ${process.env.DOCKER_URL}, dockerName: ${process.env.DOCKER_NAME}`)
  debug(`project.json contains: ` + (project.config ? (project.config.docker ? JSON.stringify(project.config.docker) : 'config.docker is undefined') : 'config is undefined'))

  // calculating image config
  const image = (dockerNS ? dockerNS + '/' : '') + dockerName
  const imageRepo = (dockerURL ? dockerURL + '/' : '') + image
  debug(`creating tags for ${imageRepo}`)

  let commandQueue = []
  tagList.forEach((e) => {
    const cmd = `docker tag ${image}:latest ${imageRepo}:${e}`
    commandQueue.push(cmd)
  })

  tagList.forEach((e) => {
    const cmd = `docker push ${imageRepo}:${e}`
    commandQueue.push(cmd)
  })

  function getCommandQueue () {
    return commandQueue
  }

  return {
    getCommandQueue
  }
}
