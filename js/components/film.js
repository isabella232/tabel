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

import { webglController } from "../controllers/webglController";
import { h } from "preact";
import { BaseComponent } from "./base";
import { bindAll } from "mout/object";
import { makeTitle, makePlay } from "../utils/ui";
import { set, get } from "../model";
import { Vector2 } from "three";
import { CircleLoader } from "./circle-loader";
import { Background } from "./background";

export class Film extends BaseComponent {

    constructor() {
        super();

        this.mouse = new Vector2();
        this.raf = null;

        this.state.isReady = webglController.isComplete;
        this.state.isLoading = webglController.isLoading;
        this.state.pageReady = get( "init" );
        this.state.showLogo = get( "init" );
        this.state.preloaded = get( "preloaded" );
        this.state.gate = false;
        this.state.animateOut = false;
        this.state.blackOut = false;
        this.state.fadeBlack = false;

        this.bindings.pageReady = "init";
        this.bindings.preloaded = "preloaded";

        bindAll( this, "onWebGLReady", "onMouseMove", "onEnterFrame", "onStartMono" );

        if ( ! this.state.isReady ) webglController.on( "complete", this.onWebGLReady );
    }

    componentDidMount() {

        if ( ! this.state.showLogo ) {

            setTimeout( () => this.setState( { showLogo: true } ), 500 );

        } else if ( get( "previous_section" ) === "play" ) {

            this.addClass( "animate-in-black" );

            setTimeout( this.removeClass, 100, "animate-in-black" );

        } else {
            super.componentDidMount();
        }

        this.mouse.set( 0, 0 );
        this.raf = requestAnimationFrame( this.onEnterFrame );

        window.addEventListener( "mousemove", this.onMouseMove );
    }

    onEnterFrame() {

        if ( this.state.gate ) return;

        const rotation =
            "rotateX(" + ( - this.mouse.y * 13 ) + "deg) " +
            "rotateY(" + ( this.mouse.x * 8 ) + "deg)";

        this.logoElement.style.transform = rotation;
        this.line1Element.style.transform = rotation;
        this.line2Element.style.transform = rotation;

        this.raf = requestAnimationFrame( this.onEnterFrame );
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        this.logoElement.style.transform = "";
        this.line1Element.style.transform = "";
        this.line2Element.style.transform = "";

        webglController.removeListener( "complete", this.onWebGLReady );

        cancelAnimationFrame( this.raf );
        window.removeEventListener( "mousemove", this.onMouseMove );
    }

    onClearSection() {
        super.onClearSection();
        this.setState( { animateOut: true } );
    }

    onMouseMove( event ) {
        this.mouse.set(
            - 1 + ( event.pageX / window.innerWidth ) * 2,
            - 1 + ( event.pageY / window.innerHeight ) * 2
        );
    }

    onWebGLReady() {
        webglController.removeListener( "complete", this.onWebGLReady );
        this.setState( { isReady: true } );
    }

    onCloseClick() {
        this.setState( { gate: false } );
        set( "menuHidden", false );
    }

    onStartMono() {
        this.setState( { blackOut: true } );

        setTimeout( () => this.setState( { fadeBlack: true } ), 16 );
        setTimeout( () => set( "route", "play" ), 700 );
    }

    onStartLoading() {
        if ( get( "isIPhone" ) || get( "isSafari" ) ) {
            set( "menuHidden", true );

            const mode = get( "isIPhone" ) ? "iphone" : "safari";

            this.setState( { gate: mode } );
            return;
        }

        webglController.loadAssets();

        this.setState( { isLoading: true } );
    }

    getButton() {
        if ( ! this.state.pageReady )
            return <div class="play clickable">{ makeTitle( "START") }</div>;

        if ( ! this.state.isLoading ) {
            return (
                <div class="play clickable" onClick={ this.onStartLoading.bind( this ) }>
                    { makeTitle( "START" ) }
                </div>
            );
        } else if ( this.state.isLoading && ! this.state.isReady ) {

            return <CircleLoader percent={ this.state.preloaded } />;

        } else {
            return (
                <div class="play clickable" onClick={ this.onStartMono } style="display: block">
                    { makePlay() }
                </div>
            );
        }
    }

    getGate() {
        if ( ! this.state.gate ) return null;

        return (
            <div class="layer iphone-gate">

                <h2 class="snap">{ makeTitle( "Aww Snap" ) }</h2>

                { ( this.state.gate === "iphone" ) ? (
                    <div class="message">
                        your device doesn't currently support 360 video. To watch the film please
                        view on your computer or Android device.
                    </div>
                ) : (
                    <div class="message">
                        your browser doesn't currently support this 360 video. To watch the film,
                        please switch to Chrome, Firefox, or Edge.
                    </div>
                ) }

                <div class="close" onClick={ this.onCloseClick.bind( this ) }></div>
            </div>
        );
    }

    render( props, { pageReady, showLogo, animateOut, blackOut, fadeBlack } ) {
        return (
            <div id="film" class={ "section" + ( pageReady ? "" : " preloading" ) }>

                <Background animateOut={ animateOut }/>

                <div class="layer white-cover">

                    <div class="center"
                         style={
                            "transform-style:" +
                                ( this.state.gate || get( "isMobile" ) ? "flat" : "preserve-3d" )
                         }>

                        <div class={ "logo" + ( showLogo ? "" : " distant") }
                             ref={ ( dom ) => this.logoElement = dom }>
                            { makeTitle( "Tabel", true ) }
                        </div>

                        <div class={ "subtitle subtitle-1" + ( showLogo ? "" : " distant" ) }
                             ref={ ( dom ) => this.line1Element = dom }>
                            A Tasty Allegory for Global Inaction
                        </div>

                        <div class={ "subtitle subtitle-2" + ( showLogo ? "" : " distant" ) }
                             ref={ ( dom ) => this.line2Element = dom }>
                            in the Face of Climate Catastrophe
                        </div>

                        <div class={ "subtitle-mobile" + ( showLogo ? "" : " distant" ) }>
                            <div class="line-1">A Tasty Allegory for</div>
                            <div class="line-2">Global Inaction</div>
                            <div class="line-3">in the Face of</div>
                            <div class="line-4">Climate Catastrophe</div>
                        </div>

                        { this.getButton() }
                    </div>

                    { this.getGate() }
                </div>

                <div class={
                    "black-cover " + ( blackOut ? "visible " : "" ) + ( fadeBlack ? "show" : "" )
                }></div>
            </div>
        );
    }
}
