# Copyright 2014 Google Inc. All rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the 'License');
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
import json
import logging
import os
import re

from base import handlers

import base.constants

IS_IE_REGEX = re.compile(r"MSIE|Trident", re.IGNORECASE)

# Minimal set of handlers to let you display main page with examples
class RootHandler(handlers.BaseHandler):

  def get(self):

    if IS_IE_REGEX.search(self.request.headers.get('User-Agent')):
      self.render('no-support.html')
      return

    self.render('index.html')


class BlockHandler(handlers.BaseHandler):

  def get(self):
    self.render('no-support.html')


class NoWebGLHandler(handlers.BaseHandler):

  def get(self):
    self.render('no-webgl.html')


class CspHandler(handlers.BaseAjaxHandler):

  def post(self):
    try:
      report = json.loads(self.request.body)
      logging.warn('CSP Violation: %s' % (json.dumps(report['csp-report'])))
      self.render_json({})
    except:
      self.render_json({'error': 'invalid CSP report'})

