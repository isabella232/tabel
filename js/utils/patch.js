/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const vendors = [ "webkit", "moz", "o", "ms" ];

export function enterFullscreen( element ) {

    element = element || document.body;

    if ( element.requestFullscreen ) element.requestFullscreen();
    else {
        for ( let prefix of vendors ) {
            let name = prefix + "RequestFullScreen";
            if ( element[ name ] ) {
                element[ name ]();
                break;
            }
        }
    }
}

export function isFullScreenEnabled() {
    for ( let prefix of vendors ) {
        let name = prefix + "CurrentFullScreenElement";
        if ( document[ name ] !== undefined ) {
            return !!document[ name ];
        }
    }
}

export function exitFullscreen() {
    for ( let prefix of vendors ) {
        let name = prefix + "ExitFullscreen";
        console.log( name );
        if ( document[ name ] ) {
            document[ name ]();
            break;
        }
    }
}
