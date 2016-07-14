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

import { bindAll } from "mout/object";
import { vent } from "../vent";
import { get } from "../model";
import {
    Texture,
    RepeatWrapping,
    MeshBasicMaterial,
    DoubleSide,
    Mesh,
    LinearFilter
} from "three";


export class CostumEvent {
    constructor( type ) {
        this.type = type;
    }
}

export class VideoMesh extends Mesh {
    constructor( geometry, videoTexture ) {

        const material = new MeshBasicMaterial( { side: DoubleSide, map: videoTexture } );

        super( geometry, material );

        this.videoTexture = videoTexture;

        const forwardEvent = this.dispatchEvent.bind( this );

        videoTexture.addEventListener( "playing", forwardEvent );
        videoTexture.addEventListener( "ready", forwardEvent );
        videoTexture.addEventListener( "pause", forwardEvent );
    }

    load() {
        this.videoTexture.loadVideo();
    }

    update() {
        this.videoTexture.update();
    }

    play() {
        this.videoTexture.play();
    }

    pause() {
        this.videoTexture.pause();
    }

    resume() {
        this.videoTexture.play();
    }

    stop() {
        this.videoTexture.stop();
    }

    seek( percent ) {
        return this.videoTexture.seek( percent );
    }

    get progress() {
        return this.videoTexture.progress;
    }

    get time() {
        return this.videoTexture.time;
    }

    set time( value ) {
        this.videoTexture.time = value;
    }

    get isPlaying() {
        return this.videoTexture.isPlaying;
    }
}

export class VideoTexture extends Texture {
    constructor( modelName, width, height, progressEventName, flip = false ) {

        const video = document.createElement( "video" );
        video.crossOrigin = "anonymous";
        video.width = width;
        video.height = height;
        video.volume = 0;

        super( video );

        bindAll( this,
            "onLoadProgress",
            "onCanPlayThrough",
            "onVideoReady",
            "onPlaying",
            "onPause"
        );

        this.eventName = progressEventName;
        this.video = video;
        this.lastUpdate = 0;

        this.magFilter = LinearFilter;
        this.minFilter = LinearFilter;

        if ( flip ) {
            this.wrapS = RepeatWrapping;
            this.repeat.x = - 1;
        }

        this.appendSourceTags( modelName );
    }

    appendSourceTags( modelName ) {
        const object = get( modelName );

        let source;

        // We need to make sure that MP4 is tried first
        [ "mp4", "webm" ].forEach( ( key ) => {
            source = document.createElement( "source" );
            source.setAttribute( "type", "video/" + object[ key ].split( "." ).pop() );
            source.setAttribute( "src", object[ key ] );

            this.video.appendChild( source );
        } );
    }

    loadVideo() {
        this.video.load();
        this.video.play();
        this.video.addEventListener( "progress", this.onLoadProgress );

        // if no progress is indicated after 0.5 minutes, we go ahead
        // and play anyway.
        this.timeout = setTimeout( () => {
            vent.emit( this.eventName, 1 );
            this.sendReadyUpdate();
        }, 30000 );
    }

    sendReadyUpdate() {
        this.video.removeEventListener( "progress", this.onLoadProgress );
        this.video.removeEventListener( "canplaythrough", this.onCanPlayThrough );
        this.video.addEventListener( "playing", this.onPlaying );
        this.video.addEventListener( "pause", this.onPause );

        this.dispatchEvent( new CostumEvent( "ready" ) );
    }

    onLoadProgress() {
        let percent;

        try {

            percent = this.video.buffered.end( 0 ) / this.video.duration;
            clearTimeout( this.timeout );

        } catch ( exception ) {

            percent = ( this.video.currentTime / this.video.duration ) || 0 ;

        }

        const goal = 0.05;
        const goalPercent = percent / goal;

        vent.emit( this.eventName, Math.min( goalPercent, 1 ) );

        if ( percent >= goal) {
            this.video.removeEventListener( "progress", this.onLoadProgress );
            this.video.pause();
            this.video.currentTime = 0;

            clearTimeout( this.timeout );

            setTimeout( this.sendReadyUpdate.bind( this ), 100 );
        }
    }

    onPlaying() {
        this.dispatchEvent( new CostumEvent( "playing" ) );
    }

    onPause() {
        this.dispatchEvent( new CostumEvent( "pause" ) );
    }

    update() {
        this.needsUpdate = true;
    }

    play() {
        this.video.volume = 1;
        this.video.play();
    }

    pause() {
        this.video.pause();
    }

    stop() {
        this.video.pause();
        this.video.currentTime = 0;
    }

    seek( percent ) {
        this.video.pause();
        this.video.currentTime = percent * this.video.duration;

        setTimeout( () => {
            this.video.play();
        } );
    }

    get progress() {
        return this.video.currentTime / this.video.duration;
    }

    get time() {
        return this.video.currentTime;
    }

    set time( value ) {
        this.video.currentTime = value;
    }

    get isPlaying() {
        return ! this.video.paused;
    }
}
