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

export function tween( time, update ) {
    const start = Date.now();

    let isCanceled = false;
    let isComplete = false;

    let chain = [];

    function loop() {
        if ( isCanceled ) return;

        const difference = Date.now() - start;
        const delta = difference / time;

        if ( delta >= 1 ) {
            isComplete = true;
            update( 1 );
            chain.forEach( ( callback ) => callback() );
        } else {
            update( delta );
            requestAnimationFrame( loop );
        }
    }

    requestAnimationFrame( loop );

    return {
        cancel() {
            isCanceled = true;
        },

        after( callback ) {
            isComplete ? callback() : chain.push( callback );
        },

        isComplete() {
            return isComplete;
        }
    };
}

export function tweenValue( value ) {

    let lerp;
    let start = value;
    let difference;

    function update( t ) {
        value = start + t * difference;
    }

    function get() {
        return value;
    }

    function set( v ) {
        if ( value === v ) return;

        if ( lerp ) lerp.cancel();

        start = value;
        difference = v - start;

        lerp = tween( 900, update );
    }

    function setImmediate( v ) {
        if ( lerp ) lerp.cancel();

        value = v;
    }

    return { get, set, setImmediate };
}

export function attractor( value ) {

    let target = value;

    function set( v ) {
        target = v;
    }

    function update() {
        value += ( target - value ) / 10;
    }

    function get() {
        return value;
    }

    return { set, get, update };
}
