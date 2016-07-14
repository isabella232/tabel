# Copyright 2014 Google Inc. All rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
#     Unless required by applicable law or agreed to in writing, software
#     distributed under the License is distributed on an "AS IS" BASIS,
#     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#     See the License for the specific language governing permissions and
#     limitations under the License.
"""Main application entry point."""

import base.api_fixer

import webapp2

import base
import base.constants
import handlers


# These should all inherit from base.handlers.BaseHandler
_UNAUTHENTICATED_ROUTES = [('/', handlers.RootHandler),
                           ('/film', handlers.RootHandler),
                           ('/about', handlers.RootHandler),
                           ('/cast', handlers.RootHandler),
                           ('/tech', handlers.RootHandler),
                           ('/credits', handlers.RootHandler),
                           ('/faq', handlers.RootHandler),
                           ('/making-of', handlers.RootHandler),
                           ('/no-support', handlers.BlockHandler),
                           ('/no-webgl', handlers.NoWebGLHandler)]


_CONFIG = {
    'csp_policy': {
        # Disallow Flash, etc.
        'object-src': '\'none\'',
        # Strict CSP with fallbacks for browsers not supporting CSP v3.
        # 'script-src': base.constants.CSP_NONCE_PLACEHOLDER_FORMAT +
        #               # Propagate trust to dynamically created scripts.
        #               '\'strict-dynamic\' '
        #               # Fallback. Ignored in presence of a nonce
        #               '\'unsafe-inline\' '
        #               # Fallback. Ignored in presence of strict-dynamic.
        #               'https: http:',
        'style-src':  '\'self\' \'unsafe-inline\' https://fonts.googleapis.com https://*.gstatic.com https://tagmanager.google.com',
        'script-src': '\'unsafe-eval\' \'unsafe-inline\' \'self\' tagmanager.google.com *.googleanalytics.com *.googleadservices.com *.google-analytics.com maps.google.com '
                  '*.googletagmanager.com maps.gstatic.com cdnjs.cloudflare.com code.jquery.com maps.googleapis.com ',
        'report-uri': '/csp',
        'reportOnly': base.constants.DEBUG,
    }
}

#################################
# DO NOT MODIFY BELOW THIS LINE #
#################################

app = webapp2.WSGIApplication(
    routes=(_UNAUTHENTICATED_ROUTES),
    debug=base.constants.DEBUG,
    config=_CONFIG)
