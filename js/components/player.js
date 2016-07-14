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

import { h, Component } from "preact";
import { webglController, hasVRDisplays } from "../controllers/webglController";
import { bindAll } from "mout/object";
import { set, get } from "../model";
import { enterFullscreen, exitFullscreen, isFullScreenEnabled } from "../utils/patch";

export class Player extends Component {

    constructor() {
        super();

        bindAll( this,
            "onProgress",
            "onPlayToggle",
            "enableScreenMode",
            "refreshTimeout",
            "onScrubHover",
            "onScrubLeave",
            "onScrubEnter",
            "onScrubClick" );
    }

    componentDidMount() {
        this.player.appendChild( webglController.getDOM() );

        webglController.on( "experience_progress", this.onProgress );
        webglController.on( "play_change", this.onPlayToggle );
        webglController.setVisibility( true );

        setTimeout( () => webglController.startVideo(), 100 );

        this.onPlayToggle();

        set( "menuHidden", true );

        if ( get( "isMobile" ) ) {
            this.base.addEventListener( "touchstart", this.refreshTimeout );
            this.refreshTimeout();
        }

        this.hideCover();
    }

    refreshTimeout() {
        this.disableScreenMode();

        clearTimeout( this.timeout );

        if ( get( "isMobile" ) ) this.timeout = setTimeout( this.enableScreenMode, 4000 );
    }

    enableScreenMode() {
        if ( get( "isMobile" ) ) document.body.classList.add( "screenmode" );
    }

    disableScreenMode() {
        document.body.classList.remove( "screenmode" );
    }

    componentWillUnmount() {
        webglController.setVisibility( false );
        this.base.removeEventListener( "touchstart", this.refreshTimeout );
        clearTimeout( this.timeout );
        set( "menuHidden", false );

        this.progressBar.style.width = "";
        this.highlightBar.style.width = "";
    }

    componentDidUnmount() {
        webglController.removeListener( "experience_progress", this.onProgress );
        webglController.removeListener( "play_change", this.onPlayToggle );
        webglController.stopVideo();

        this.disableScreenMode();
    }

    onProgress( percent ) {
        if ( percent === -1 ) {
            this.progressBar.style.width = "";
            return;
        }

        this.progressBar.style.width = percent * 100 + "%";
    }

    calculateProgress( event ) {
        event.preventDefault();
        event.stopImmediatePropagation();

        return event.offsetX / event.currentTarget.clientWidth;
    }

    onScrubClick( event ) {
        webglController.jumpTo( this.calculateProgress( event ) );
    }

    onScrubHover( event ) {
        const percent = this.calculateProgress( event );

        this.highlightBar.style.width = percent * 100 + "%";
    }

    onScrubLeave( event ) {
        event.preventDefault();
        event.stopImmediatePropagation();

        this.highlightBar.style.transition = "width 0.5s";
        this.highlightBar.style.width = "";
    }

    onScrubEnter( event ) {
        event.preventDefault();
        event.stopImmediatePropagation();

        this.highlightBar.style.transition = "";
    }

    onClose() {
        webglController.removeListener( "experience_progress", this.onProgress );
        this.onProgress( -1 );
        this.showCover();

        set( "route", "film" );
        set( "menuHidden", false );
    }

    showCover() {
        const cover = this.base.querySelector( "#player-cover" );
        cover.style.display = "block";

        requestAnimationFrame( () => cover.style.opacity = 1 );
    }

    hideCover() {
        const cover = this.base.querySelector( "#player-cover" );
        cover.style.opacity = 1;
        cover.style.display = "block";

        setTimeout( () => cover.style.opacity = 0, 410 );
        setTimeout( () => cover.style.display = "none", 1200 );
    }

    onPlayToggle() {
        if ( webglController.isPlaying ) {
            this.playButton.classList.remove( "play" );
            this.playButton.classList.add( "pause" );
            this.refreshTimeout();
        } else {
            this.playButton.classList.remove( "pause" );
            this.playButton.classList.add( "play" );
            clearTimeout( this.timeout );
        }
    }

    onPlayButton() {
        if ( webglController.isPlaying ) webglController.pause();
        else webglController.resume();
    }

    onVRClick() {
        if ( hasVRDisplays ) {
            webglController.toggleVR();
        } else {
            if ( isFullScreenEnabled() ) exitFullscreen();
            else enterFullscreen( this.base );
        }
    }

    render() {
        return (
            <div id="player">
                <div id="player-holder" class="layer" ref={ ( dom ) => this.player = dom }></div>
                <div class="layer">

                    <div class="controls">
                        <div class="play-controls"
                             onClick={ this.onPlayButton.bind( this ) }
                             ref={ ( dom ) => this.playButton = dom }></div>

                        <div
                            class="scrub-controls"
                            onClick={ this.onScrubClick }
                            onMouseMove={ this.onScrubHover }
                            onMouseLeave={ this.onScrubLeave }
                            onMouseEnter={ this.onScrubEnter }>

                            <div class="scrub-bar">
                                <div class="highlight"
                                     ref={ ( dom ) => this.highlightBar = dom }></div>
                                <div class="progress"
                                     ref={ ( dom ) => this.progressBar = dom }></div>
                            </div>
                        </div>

                        <div class="vr-controls" onClick={ this.onVRClick.bind( this ) }>
                            { hasVRDisplays ?
                                <svg xmlns="http://www.w3.org/2000/svg"
                                     version="1.1"
                                     x="0px"
                                     y="0px"
                                     viewBox="0 0 90 90"
                                     enable-background="new 0 0 90 90">
                                    <path d="M81.671,21.323c-2.085-2.084-72.503-1.553-74.054,0c-1.678,1.678-1.684,46.033,0,47.713  c0.558,0.559,12.151,0.896,26.007,1.012l3.068-8.486c0,0,1.987-8.04,7.92-8.04c6.257,0,8.99,9.675,8.99,9.675l2.555,6.848  c13.633-0.116,24.957-0.453,25.514-1.008C83.224,67.483,83.672,23.324,81.671,21.323z M24.572,54.582  c-6.063,0-10.978-4.914-10.978-10.979c0-6.063,4.915-10.978,10.978-10.978s10.979,4.915,10.979,10.978  C35.551,49.668,30.635,54.582,24.572,54.582z M64.334,54.582c-6.063,0-10.979-4.914-10.979-10.979  c0-6.063,4.916-10.978,10.979-10.978c6.062,0,10.978,4.915,10.978,10.978C75.312,49.668,70.396,54.582,64.334,54.582z"/>
                                </svg> :

                                <svg height="24"
                                     viewBox="0 0 24 24"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                                </svg> }
                        </div>

                    </div>

                    <div class="close" onClick={ this.onClose.bind( this ) }></div>
                </div>
                <div id="player-cover" class="layer"></div>
            </div>
        );
    }
}
