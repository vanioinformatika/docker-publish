<h1 align="left">
  Docker Publish
  <br>
  <br>
</h1>

<p align="left">
  <a href="https://travis-ci.org/vanioinformatika/docker-publish"><img src="https://travis-ci.org/vanioinformatika/docker-publish.svg?branch=master" alt="Travis"></a>
  <a href="http://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="Standard - JavaScript Style Guide"></a>
  <a href="https://www.npmjs.com/package/standard"><img src="https://img.shields.io/npm/dm/standard.svg" alt="npm downloads"></a>
  <a href="https://www.npmjs.com/package/standard"><img src="https://img.shields.io/npm/v/standard.svg" alt="npm version"></a>
</p>

<h4 align="center">Simple Docker tagging and publishing from npm</h4>

<br>

Install:

```
npm i -D @vanioinformatika/docker-publish
```

Creating tags and push into Docker Registry with one command.

```
npm run @vanioinformatika/docker-publish
```

## Releasing

*Best practice:* Running _npm version_, and _postversion_ contains _docker-publish._

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

## Snapshot

If you want to publish a _snapshot_, the image will be tagged with git commit id, and the commit's number since last version, and pushed.
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

## Configuration

There is zero configuration. All parameters comes from package.json *name* and *version* properties.

_* Maybe you want to use your own private docker repository, in this case see the next chapter._

### Customization

Optionally, in package.json you can customize your docker properties:

```json
'version': '1.3.5',
'name': 'docker-publish',
'config': {
  'docker': {
    'ns': 'namespace',
    'url': 'docker.yourcompany.com:5000',
    'name': 'myapp',
    'skip': false,
    'silence': false
  }
}
```

CLI parameters could overwites package.json properties (except version number).

- *DOCKER_URL* your private docker repository URL; _docker.yourcompany.com:5000_

- *DOCKER_NS* your namespace for image; _namespace/imagename:tag_ Default: empty

- *DOCKER_NAME* overwrite image name. Default: package.json _name_ properties

- *DOCKER_SKIP* Skip Docker tag and push commands (dry run with logging). Default: false

- *DOCKER_SILENCE* Do not logging. Default: false
