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

import { Component, h } from "preact";
import { attractor, tweenValue } from "../utils/tween";
import { ShaderPass } from "../controllers/shaderPass";
import { Vector2 } from "three";
import { createCanvas } from "../utils/graphics";
import { get } from "../model";
import { loadImage } from "../controllers/loadManager";
import debounce from "mout/function/debounce";
import bindAll from "mout/object/bindAll";
import clamp from "mout/math/clamp";
import createShader from "gl-shader";
import createTexture from "gl-texture2d";
import drawTriangle from "a-big-triangle";

const glslify = require( "glslify" );

// reusable vectors. Only use within scope, as there is no
// guarantee that the values won't be overwritten.
const vector2 = new Vector2();

export class Background extends Component {

    constructor() {
        super();

        this.state.isPhone = get( "isIPhone" );

        if ( this.state.isPhone ) return;

        this.state.animateIn = false;
        this.previousAnimateOut = false;
        this.mouse = new Vector2();
        this.mouseSpeed = attractor( 0 );
        this.mouseDirection = new Vector2( 1, 0 );
        this.mouseDirectionTarget = new Vector2( 1, 0 );
        this.isMouseMoving = false;
        this.windowSize = new Vector2( window.innerWidth, window.innerHeight );

        this.percent = tweenValue( -1 );
        this.delayedMouseReset = debounce( this.mouseReset.bind( this ), 100 );

        bindAll( this,
            "onEnterFrame",
            "onResize",
            "onMouseMove",
            "onTouchStart",
            "onTouchMove",
            "updatePassUniforms" );
    }

    componentWillMount() {
        this.percent.setImmediate( -1 );
    }

    componentDidMount() {
        if ( this.state.isPhone ) return;

        setTimeout( this.percent.set, 200, 0 );

        this.onResize();

        const gl = this.gl =
            this.canvas.getContext( "webgl" ) ||
            this.canvas.getContext( "experimental-webgl" );

        try {

            this.shaderPass = new ShaderPass(
                gl,
                32,
                glslify( __dirname + "/../shaders/pass.glsl" )
            );

        } catch( exception ) {

            console.warn( exception.message );

            this.setState( { isPhone: true } );

            this.gl = null;
            this.canvas = null;

            return;
        }

        gl.disable( gl.DEPTH_TEST );
        gl.enable( gl.BLEND );
        gl.blendFunc( gl.SRC_ALPHA, gl.ONE );

        this.shader = createShader( gl,
            glslify( __dirname + "/../shaders/vertex.glsl" ),
            glslify( __dirname + "/../shaders/fragment.glsl" )
        );

        this.backgroundTexture = createTexture( gl, createCanvas( 1024, 1024 ) );
        this.backgroundTexture.magFilter = gl.LINEAR;
        this.backgroundTexture.minFilter = gl.LINEAR;

        this.loadAssets();

        window.addEventListener( "resize", this.onResize );
        window.addEventListener( "orientationchange", this.onResize );

        document.addEventListener( "mousemove", this.onMouseMove );
        document.addEventListener( "touchstart", this.onTouchStart );
        document.addEventListener( "touchmove", this.onTouchMove );

        this.onEnterFrame();
    }

    componentDidUnmount() {
        if ( this.state.isPhone ) return;

        this.backgroundTexture.dispose();
        this.shader.dispose();
        this.animateOutPercent = 0;

        this.gl = null;
        this.canvas = null;
    }

    componentWillUnmount() {
        if ( this.state.isPhone ) return;

        window.cancelAnimationFrame( this.raf );
        window.removeEventListener( "resize", this.onResize );
        window.removeEventListener( "orientationchange", this.onResize );

        document.removeEventListener( "mousemove", this.onMouseMove );
        document.removeEventListener( "touchstart", this.onTouchStart );
        document.removeEventListener( "touchmove", this.onTouchMove );
    }

    loadAssets() {
        if ( this.image ) return;

        loadImage( "/static/images/background.jpg" ).then( ( image ) => {
            this.image = image;
            this.backgroundTexture.setPixels( image );
        } );
    }

    onResize() {
        const dpr = clamp( window.devicePixelRatio || 1, 1, 2 );

        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;

        if ( ! this.gl ) return;

        this.gl.viewport( 0, 0, this.canvas.width, this.canvas.height );

        this.windowSize.set( window.innerWidth, window.innerHeight );
    }

    onMouseMove( event ) {
        vector2.set( event.pageX, event.pageY ).divide( this.windowSize );

        this.mouseSpeed.set( Math.min( this.mouse.distanceTo( vector2 ), 0.3 ) );
        this.mouseDirectionTarget.subVectors( vector2, this.mouse ).normalize();
        this.mouse.copy( vector2 );

        this.delayedMouseReset();
    }

    mouseReset() {
        this.mouseSpeed.set( 0 );
    }

    onTouchStart( event ) {
        this.onMouseMove( {
            pageX: event.touches[ 0 ].pageX,
            pageY: event.touches[ 0 ].pageY
        } );
    }

    onTouchMove( event ) {
        this.onMouseMove( {
            pageX: event.touches[ 0 ].pageX,
            pageY: event.touches[ 0 ].pageY
        } );
    }

    onEnterFrame() {

        if ( this.props.animateOut && ! this.previousAnimateOut ) {
            this.previousAnimateOut = this.props.animateOut;
            this.percent.set( 1 );
        }

        this.raf = window.requestAnimationFrame( this.onEnterFrame );
        this.mouseSpeed.update();
        this.mouseDirection.lerp( this.mouseDirectionTarget, 0.5 ).normalize();

        if ( isNaN( this.mouseDirection.x ) || isNaN( this.mouseDirection.y ) ) {
            this.mouseDirection.set( 1, 0 );
        }

        if ( ! this.gl ) return;

        this.shaderPass.step( this.updatePassUniforms );

        // we have to reset this because the shaderpass adjusts the gl viewport to its size.
        // It doesn't set it back because it doesn't know what it was before.
        this.gl.viewport( 0, 0, this.canvas.width, this.canvas.height );

        this.shader.bind();
        this.shader.uniforms.resolution = [ this.canvas.width, this.canvas.height ];
        this.shader.uniforms.backgroundMap = this.backgroundTexture.bind( 0 );
        this.shader.uniforms.displacementMap = this.shaderPass.getTexture().bind( 1 );
        this.shader.uniforms.mouse = [ this.mouse.x, this.mouse.y, this.mouseSpeed.get() ];
        this.shader.uniforms.mouseDirection = [ this.mouseDirection.x, this.mouseDirection.y ];

        drawTriangle( this.gl );
    }

    updatePassUniforms( uniforms ) {
        uniforms.t = this.percent.get();
    }

    render( props, { isPhone } ) {
        if ( isPhone ) return <div id="image-canvas" class="iphone"></div>;
        else return <canvas id="image-canvas" ref={ ( dom ) => this.canvas = dom }></canvas>;
    }
}
