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

import { vent } from "../vent";

let AudioContext = window.AudioContext || window.webkitAudioContext;

export const audioContext = AudioContext ? new AudioContext() : null;

export function bufferFile( buffer ) {

    let source = audioContext.createBufferSource();
    let gain = audioContext.createGain();
    let panner = audioContext.createPanner();

    source.buffer = buffer;
    source.connect( gain );

    gain.connect( panner );

    panner.coneInnerAngle = 360;
    panner.coneOuterAngle = 0;
    panner.connect( audioContext.destination );

    return {
        buffer: buffer,
        sourceNode: source,
        gainNode: gain,
        pannerNode: panner
    };
}

export function bufferFileSimple( buffer ) {
    let source = audioContext.createBufferSource();
    let gain = audioContext.createGain();

    source.buffer = buffer;
    source.connect( gain );

    gain.connect( audioContext.destination );

    return {
        buffer: buffer,
        sourceNode: source,
        gainNode: gain
    };
}

export function decodeFile( file ) {
    return new Promise( function( resolve ) {
        audioContext.decodeAudioData( file, function( bytes ) {
            vent.emit( "audio_file_decoded" );
            resolve( bytes );
        } );
    } );
}

export function loadFile( path ) {
    return new Promise( function( resolve ) {

        const request = new XMLHttpRequest();
        request.responseType = "arraybuffer";
        request.open( "GET", path, true );

        request.onload = function() {
            vent.emit( "audio_file_loaded" );
            resolve( request.response );
        };

        request.send();
    } );
}

export function decodeFiles( files ) {
    return Promise.all( files.map( decodeFile ) );
}

export function bufferFiles( files ) {
    return files.map( bufferFile );
}

export function loadFiles( paths ) {
    return Promise.all( paths.map( loadFile ) );
}
