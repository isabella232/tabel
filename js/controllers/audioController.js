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

import { loadFiles, bufferFiles, decodeFiles, audioContext, bufferFileSimple } from "../loaders/audioLoader";
import { EventEmitter } from "events";
import { Vector3, Quaternion } from "three";
import { map, clamp } from "mout/math";
import { fromTo } from "../utils/math";
import { getLocationVector, getMobileLocationVector } from "./locationFactory";
import { get } from "../model";

// Reusable objects
const crossproduct = new Vector3();
const quaternion = new Quaternion();
const relativeSpot = new Vector3();
const eyeVector = new Vector3();
const zero = new Vector3();

// the spots have to be in the same order as the array of the audio
// files in model.js
const spots = [
    getLocationVector( "waiter" ),
    getLocationVector( "engineers" ),
    getLocationVector( "business" ),
    getLocationVector( "critic" ),
    getLocationVector( "dj" ),
    getLocationVector( "mayor" )
];

const mobileSpots = get( "mobileAudioPaths" ).map( ( value, i ) => getMobileLocationVector( i ) );

const waiterFocus = [
    [ 34, 92 ],
    [ 250, 271 ],
    [ 439, 448 ]
];

export function getAudioPlayerClass() {
    if ( get( "isMobile" ) ) return AudioMobilePlayer;
    else return AudioPlayer;
}

export class AudioPlayer extends EventEmitter {

    constructor() {
        super();
        this.paths = get( "audioPaths" );
        this.sounds = [];
    }

    load() {
        loadFiles( this.paths )
            .then( decodeFiles )
            .then( ( files ) => {
                this.files = files;
                this.emit( "loaded" );
            } );
    }

    refresh() {
        this.sounds = bufferFiles( this.files.slice( 0, this.files.length - 1 ) );

        // replace the last buffer, which is the one for background
        // music with one that has no positional audio node
        const i = this.sounds.length;
        this.sounds[ i ] = bufferFileSimple( this.files[ i ] );
        this.sounds[ i ].gainNode.value = 1;
    }

    play( time = 0 ) {
        this.sounds.forEach( ( sound ) => sound.sourceNode.start( 0, time ) );
    }

    pause() {
        audioContext.suspend();
    }

    resume() {
        audioContext.resume();
    }

    stop() {
        this.sounds.forEach( ( sound ) => sound.sourceNode.stop() );
    }

    seek( seconds ) {
        this.stop();
        this.refresh();
        this.play( seconds );
    }

    isWaiterInFocus( time ) {
        for ( var i = 0; i < 3; i++ ) {
            if ( time >= waiterFocus[ i ][ 0 ] && time <= waiterFocus[ i ][ 1 ] ) return true;
        }

        return false;
    }

    updateCamera( cameraTarget, time ) {

        const sounds = this.sounds;

        if ( ! sounds ) return;

        fromTo( zero, cameraTarget, eyeVector );

        eyeVector.normalize();

        var percent;
        var w;
        const length = spots.length;

        for ( var i = 0; i < length; i++ ) {
            spots[ i ].setTime( time );

            percent = eyeVector.angleTo( spots[ i ].reversed ) / Math.PI;
            percent = clamp( percent, 0.7, 1 );
            percent = map( percent, 0.7, 1, 0.01, 1 );
            percent = Math.cos( ( 1 - percent ) * 0.5 * Math.PI );

            crossproduct.crossVectors( eyeVector, spots[ i ] );
            w = 1 + eyeVector.dot( spots[ i ] );

            quaternion.set( crossproduct.x, crossproduct.y, crossproduct.z, w );
            quaternion.normalize();

            relativeSpot.set( 0, 0, -1 ).applyQuaternion( quaternion );

            sounds[ i ].pannerNode.setPosition( relativeSpot.x, relativeSpot.y, relativeSpot.z );

            if ( i === 0 && this.isWaiterInFocus( time ) ) sounds[ i ].gainNode.gain.value = 1;
            else sounds[ i ].gainNode.gain.value = percent;
        }
    }
}

export class AudioMobilePlayer extends AudioPlayer {

    constructor() {
        super();
        this.paths = get( "mobileAudioPaths" );
    }

    refresh() {
        this.sounds = bufferFiles( this.files );
    }

    updateCamera( cameraTarget ) {

        const sounds = this.sounds;

        if ( ! sounds ) return;

        fromTo( zero, cameraTarget, eyeVector );

        eyeVector.normalize();

        var percent;
        var w;
        const length = sounds.length;

        for ( var i = 0; i < length; i++ ) {
            percent = eyeVector.angleTo( mobileSpots[ i ].reversed ) / Math.PI;
            percent = clamp( percent, 0.7, 1 );
            percent = map( percent, 0.7, 1, 0.01, 1 );
            percent = Math.cos( ( 1 - percent ) * 0.5 * Math.PI );

            crossproduct.crossVectors( eyeVector, mobileSpots[ i ] );
            w = 1 + eyeVector.dot( mobileSpots[ i ] );

            quaternion.set( crossproduct.x, crossproduct.y, crossproduct.z, w );
            quaternion.normalize();

            relativeSpot.set( 0, 0, -1 ).applyQuaternion( quaternion );

            sounds[ i ].pannerNode.setPosition( relativeSpot.x, relativeSpot.y, relativeSpot.z );
            sounds[ i ].gainNode.gain.value = percent;
        }
    }
}
