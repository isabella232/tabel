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

import drawTriangle from "a-big-triangle";
import createShader from "gl-shader";
import createFBO from "gl-fbo";

const glslify = require( "glslify" );

export class ShaderPass {

    constructor( gl, size, source ) {
        this.gl = gl;
        this.size = size;

        this.logic = createShader( gl, glslify( __dirname + "/../shaders/vertex.glsl" ), source );

        this.previous = createFBO( gl, size, size, { float: true, depth: false } );
        this.current = createFBO( gl, size, size, { float: true, depth: false } );
    }

    step( update ) {
        this.gl.disable( this.gl.BLEND );

        this.current.bind();
        this.gl.viewport( 0, 0, this.size, this.size );

        this.logic.bind();
        this.logic.uniforms.resolution = [ this.size, this.size ];
        this.logic.uniforms.data = this.previous.color[ 0 ].bind( 0 );

        if ( update ) update( this.logic.uniforms );

        drawTriangle( this.gl );

        this.gl.bindFramebuffer( this.gl.FRAMEBUFFER, null );

        const temp = this.previous;

        this.previous = this.current;
        this.current = temp;

        this.gl.enable( this.gl.BLEND );
    }

    getTexture() {
        return this.previous.color[ 0 ];
    }

    dispose() {
        this.logic.dispose();

        this.previous.dispose();
        this.current.dispose();

        this.logic = this.previous = this.current = undefined;
    }
}
