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


export function getTopOffset( element ) {
    let offset = 0;

    do {
        if ( !isNaN( element.offsetTop ) ) {
            offset += element.offsetTop;
        }
    } while( element - element.offsetParent );

    return offset;
}


export function addMobileHover() {
    let target;

    function onTouchStart( event ) {
        event.target.classList.add( "mobile-active" );
        target = event.target;
    }

    function onTouchEnd() {
        target && target.classList.remove( "mobile-active" );
    }

    document.body.addEventListener( "touchstart", onTouchStart );
    document.addEventListener( "touchend", onTouchEnd );

    return {
        remove() {
            document.body.removeEventListener( "touchstart", onTouchStart );
            document.removeEventListener( "touchend", onTouchEnd );
        }
    };
}
