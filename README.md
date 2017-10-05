# [Tabel](https://tabel.withgoogle.com)
__This is not an official Google product.__

With 6 storylines unfolding simultaneously, Tabel uses interactive directional audio
to put you at the center of the chaos.

## Technical specs
----
This projects is loosly based on the
[secure scafolding](https://github.com/google/gae-secure-scaffold-python) for App Engine.

The basic folder structure is as follows

* / - top level directory for common files, e.g. app.yaml, project configs
* /js - directory for uncompiled Javascript resources.
* /scss - directory for uncompiled CSS resources.
* /src - directory for all backend source code
* /static - directory for static content
* /templates - static html files.

## Prerequisites
----
These instructions have been tested with the following software:

* node.js >= 0.8.0
    * 0.8.0 is the minimum required to build with [Grunt](http://gruntjs.com/).
* git


### Dependencies
----
All dependencies come in form of NPM packages and can be installed via:

`npm install`

NPM is a package manager that comes bundled with node. If Node.js is installed
on your machine you also have NPM.

### Local Development
To run the development appserver locally:

`grunt dev`

This requires the AppEngine Python SDK to be installed on your machine. It will look
for `dev_apperserver.py` at it's default location but this might have to be adjusted in
the `Gruntfile.js`

## Notes
----
Files in `js/` are compiled by browserify and using babelify in order to convert
ES6 javascript down to ES5, which provides larger browser compatibility.
`out/static/app.js` is the output used in the browser.

The `/static` and `/template` directories are replicated in `out/`, and the
files in `src/` are rebased into `out/` (so `src/base/foo.py` becomes
`out/base/foo.py`).


## Detailed Dependency Information
-------------
* The AppEngine Python SDK should be present making `dev_appserver.py` available
globally on your system.


You can find / download this at:
<https://cloud.google.com/appengine/docs/standard/python/download>

