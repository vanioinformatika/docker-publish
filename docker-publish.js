const debug = require('debug')('docker-publish')

module.exports = (shell, project, tag, strictTag, id) => {
  if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git')
    shell.exit(1)
  }

  debug(`git tag: ${strictTag}`)

  const versionNumberArray = tag.split('.')
  let tagList = []
  if (strictTag === tag) {
    // release: npm version
    tagList.push(versionNumberArray[0])
    tagList.push(`${versionNumberArray[0]}.${versionNumberArray[1]}`)
    tagList.push(strictTag)
    tagList.push(`${strictTag}-RELEASE-${'g' + id}`)
    tagList.push('latest')
  } else {
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
