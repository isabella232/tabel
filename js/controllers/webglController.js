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

import { Globe } from "../objects/globe";
import { EventEmitter } from "events";
import { after } from "mout/function";
import { bindAll } from "mout/object";
import { getAudioPlayerClass } from "./audioController";
import { getTitleCardPlayerClass } from "./cardController";
import { PerspectiveCamera, WebGLRenderer, Scene, Vector3 } from "three";
import { get } from "../model";
import { Orientation } from "./orientationController";
import { VRControls } from "../../third_party/js/VRControls";
import { VREffect } from "../../third_party/js/VREffect";

const lookAtTarget = new Vector3( 0, 0, -1 );
const audioDelay = get( "audioUpdateRate" );

export let hasVRDisplays = undefined;

if ( ! navigator.getGamepads ) {
    const array = [ null, null, null, null ];
    navigator.getGamepads = () => array;
}


class WebGLController extends EventEmitter {
    constructor() {
        super();

        bindAll( this,
            "startVideo",
            "stopVideo",
            "onResize",
            "render",
            "onCardboardChange",
            "pause",
            "resume",
            "onPlayingVideo",
            "onPauseVideo",
            "updateAudioAngle",
            "checkSyncStatus",
            "onVRModeChange",
            "onGamepadConnected",
            "onGamepadDisconnected"
        );

        const onReady = after( () => {
            this.isComplete = true;
            this.emit( "complete" );
        }, 3 );

        this.isLoading = false;
        this.gamepad = null;
        this.isButtonDown = false;

        this.renderer = new WebGLRenderer( { antialias: false } );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setPixelRatio( 1 );

        this.camera = new PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );

        this.effect = new VREffect( this.renderer );

        this.globe = new Globe();
        this.globe.addEventListener( "ready", onReady );
        this.globe.addEventListener( "playing", this.onPlayingVideo );
        this.globe.addEventListener( "pause", this.onPauseVideo );

        this.scene = new Scene();
        this.scene.add( this.globe );

        this.controls = new VRControls( this.camera );
        this.orientation = new Orientation( this.camera );

        this.audioPlayer = new ( getAudioPlayerClass() )();
        this.audioPlayer.on( "loaded", onReady );

        this.titleCardPlayer = new ( getTitleCardPlayerClass() )();
        this.titleCardPlayer.addEventListener( "ready", onReady );
        this.titleCardPlayer.scene = this.scene;

        window.addEventListener( "resize", this.onResize );

        // Some debug helpers
        window.time = () => this.globe.time;
        window.jumpTo = ( seconds ) => this.globe.time = seconds;
        window.effect = this.effect;
        window.controls = this.controls;
        window.c = this;
    }

    loadAssets() {
        this.isLoading = true;
        this.globe.load();
        this.titleCardPlayer.load();
        this.audioPlayer.load();

        if ( hasVRDisplays === undefined ) {
            navigator.getVRDisplays()
                .then( ( displays ) => hasVRDisplays = displays.length > 0 );
        }
    }

    getDOM() {
        return this.renderer.domElement;
    }

    toggleVR() {
        if ( ! this.effect.isPresenting ) {
            this.globe.isPlaying && this.pause();
            this.effect.requestPresent().then( this.resume );
        } else {
            this.effect.exitPresent();
        }
    }

    startVideo() {
        this.isRendering = true;

        this.controls.resetPose();
        this.orientation.reset();

        this.audioPlayer.refresh();
        this.audioPlayer.play();
        this.globe.start();
        this.titleCardPlayer.play();
        this.updateAudioAngle();

        this.effect.requestAnimationFrame( this.render );

        this.interval = setInterval( () => {
            this.emit( "experience_progress", this.globe.progress );
        }, 300 );
    }

    stopVideo() {
        this.isRendering = false;

        this.globe.stop();
        this.audioPlayer.stop();
        this.titleCardPlayer.stop();

        clearInterval( this.interval );
        clearTimeout( this.audioUpdateTimeout );
        clearTimeout( this.checkSyncTimeout );

        if ( this.effect.isPresenting ) this.effect.exitPresent();

        this.renderer.clear();
    }

    pause() {
        clearTimeout( this.checkSyncTimeout );
        this.globe.pause();
    }

    resume() {
        if ( this.globe.progress === 1 ) this.orientation.reset();
        this.globe.resume();
    }

    jumpTo( percent ) {
        this.audioPlayer.stop();
        this.titleCardPlayer.pause();
        this.globe.seek( percent );
    }

    onPlayingVideo() {
        this.audioPlayer.seek( this.globe.time );
        this.emit( "play_change" );

        this.latestVideoTime = this.globe.time;
        this.latestDateTime = Date.now();

        clearTimeout( this.checkSyncTimeout );
        this.checkSyncTimeout = setTimeout( this.checkSyncStatus, 10000 );
    }

    checkSyncStatus() {
        clearTimeout( this.checkSyncTimeout );

        if ( ! this.globe.isPlaying ) return;

        const videoDifference = this.globe.time - this.latestVideoTime;
        const dateDifference = ( Date.now() - this.latestDateTime ) / 1000;

        const absoluteDifference = Math.abs( videoDifference - dateDifference );

        if ( absoluteDifference > 0.3 ) {
            this.audioPlayer.seek( this.globe.time );

            this.latestVideoTime = this.globe.time;
            this.latestDateTime = Date.now();
        }

        this.checkSyncTimeout = setTimeout( this.checkSyncStatus, 1000 );
    }

    onPauseVideo() {
        this.audioPlayer.stop();
        this.titleCardPlayer.pause();
        this.emit( "play_change" );
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    render() {
        ( this.effect.isPresenting || get( "isMobile" ) ?
          this.controls :
          this.orientation ).update();

        this.updateGamepad();

        lookAtTarget.set( 0, 0, -1 ).applyQuaternion( this.camera.quaternion.normalize() );

        this.globe.update();
        this.globe.isPlaying && this.titleCardPlayer.update( this.globe.time );

        this.titleCardPlayer.updateCamera( lookAtTarget, this.camera );

        this.effect.render( this.scene, this.camera );

        if ( this.isRendering ) this.effect.requestAnimationFrame( this.render );
    }

    updateGamepad() {
        if ( ! navigator.getGamepads()[ 0 ] ) return;

        const isPressed = navigator.getGamepads()[ 0 ].buttons[ 0 ].pressed;

        if ( ! isPressed && this.isButtonDown ) {
            this.onGamepadClick();
        }

        this.isButtonDown = isPressed;
    }

    onGamepadClick() {
        if ( this.firstClickTime > 0 && this.firstClickTime - Date.now() < 200 ) {
            clearTimeout( this.gamepadTimeout );
            this.firstClickTime = 0;
            this.jumpTo( 0 );
        } else {
            this.firstClickTime = Date.now();
            this.gamepadTimeout = setTimeout( () => {
                this.isPlaying ? this.pause() : this.resume();
                this.firstClickTime = 0;
            }, 200 );
        }
    }

    updateAudioAngle() {
        this.audioPlayer.updateCamera( lookAtTarget, this.globe.time );

        if ( this.isRendering ) {
            clearTimeout( this.audioUpdateTimeout );
            this.audioUpdateTimeout = setTimeout( this.updateAudioAngle, audioDelay );
        }
    }

    setVisibility( value ) {
        this.orientation[ value ? "bind" : "unbind" ]();
    }

    get isPlaying() {
        return this.globe.isPlaying;
    }
}

export const webglController = new WebGLController();
