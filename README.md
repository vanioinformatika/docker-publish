<h1 align="left">
  Docker Publish
  <br>
  <br>
</h1>

<p align="left">
  <a href="https://travis-ci.org/vanioinformatika/docker-publish"><img src="https://travis-ci.org/vanioinformatika/docker-publish.svg?branch=master" alt="Travis"></a>
  <a href="http://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="Standard - JavaScript Style Guide"></a>
  <a href="https://www.npmjs.com/package/@vanioinformatika/docker-publish"><img src="https://img.shields.io/npm/dm/@vanioinformatika/docker-publish.svg" alt="npm downloads"></a>
</p>

<h4 align="left">Simple Docker tagging and publishing with 'npm version'</h4>

<br>

## Prerequisite

Do not forget **installing docker** and running **docker login** before using it!

Install:

```
npm i -D @vanioinformatika/docker-publish
```

## Best practice

**Using npm run postversion:** building image, creating docker tags and push into Docker Registry with one command.

In package.json set _postversion:_

```
"preversion": "docker -v && git push && npm install && npm test",
"version": "",
"postversion": "git push && git push --tags && docker build -t $npm_package_config_docker_ns/$npm_package_name:latest . && docker-publish"
```

or with hands:

```
docker build -t namespace/appname:latest .
node ./node_modules/.bin/docker-publish
```

## Configuration

There is **zero configuration.** All parameters comes from package.json: *$npm_package_name* and *$npm_package_version* variable (name and version properties).

_* Maybe you want to use your own private docker repository, in this case please see the next chapter._

### Customization

Optionally, in package.json you can customize your docker properties:

```json
"version": "1.3.5",
"name": "docker-publish",
"config": {
  "docker": {
    "ns": "namespace",
    "url": "docker.yourcompany.com:5000",
    "name": "myapp",
    "skip": false,
    "silence": false,
    "strictSemver": false
  }
}
```

CLI parameters could overwites package.json properties (except version number).

- **DOCKER_NS:** your namespace for image; _namespace/imagename:tag_ Default: empty

- **DOCKER_URL:** your private docker repository URL; _docker.yourcompany.com:5000_

- **DOCKER_NAME:** overwrite image name. Default: package.json _name_ properties

- **DOCKER_SKIP:** Skip Docker tag and push commands (dry run with logging). Default: false

- **DOCKER_SILENCE:** Do not logging. Default: false

- **DOCKER_STRICT_SEMVER:** Strict semantic versioning tag. Default: false. If it is true, then only one tag will be created on docker image as https://semver.org defined and there is no 'v' before version number.

## Releasing

**Best practice:** _postversion_ contains **image building** and **docker-publish,** and running **npm version**

Output:

```
docker tag docker-publish:latest docker-publish:v1
docker tag docker-publish:latest docker-publish:v1.3
docker tag docker-publish:latest docker-publish:v1.3.5
docker tag docker-publish:latest docker-publish:v1.3.5-RELEASE-g993df1b
docker tag docker-publish:latest docker-publish:latest
docker push docker-publish:v1
docker push docker-publish:v1.3
docker push docker-publish:v1.3.5
docker push docker-publish:v1.3.5-RELEASE-g993df1b
docker push docker-publish:latest
```

*v1.3.5-RELEASE-g993df1b:* v1.3.5 - your version number from project.json, g993df1b - git commit ID (7 chars)

If DOCKER_STRICT_SEMVER, strictSemver is *true,* then:

```
docker tag docker-publish:latest docker-publish:1.3.5
docker push docker-publish:1.3.5
```

## Snapshot

If you want to publish a _snapshot_, the image will be tagged with git commit id, and the commit's number since last version, and pushed. If DOCKER_STRICT_SEMVER, strictSemver is *true,* then snapshot is not available.

Output:
```

docker tag docker-publish:latest docker-publish:v1.3.4-5-gb4c008b
docker push docker-publish:v1.3.4-1-gb4c008b

```

*v1.3.5-RELEASE-g993df1b:* v1.3.5 - your version number from project.json, 5 - commit's number since v1.3.4 tag, gb4c008b - last (fifth) git commit ID (7 chars

If you have never tagged git commit, then tag shows:

```
skipped: docker tag docker-publish:latest docker-publish:0bd4c74
skipped: docker push docker-publish:0bd4c74
```

Where _0bd4c74_ is the last commit id.
