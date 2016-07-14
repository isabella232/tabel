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

import { Vector2 } from "three";

export class CanvasHelper {
    constructor( width, height ) {
        this.canvas = document.createElement( "canvas" );
        this.context = this.canvas.getContext( "2d" );

        this.size = new Vector2();
        this.setSize( width, height );
    }

    setSize( width, height ) {
        this.size.set( width, height );

        this.width = this.canvas.width = width;
        this.height = this.canvas.height = height;
    }

    getData() {
        return this.getImageData().data;
    }

    getImageData() {
        return this.context.getImageData( 0, 0, this.width, this.height );
    }
}

export function createCanvas( width, height ) {
    const canvas = document.createElement( "canvas" );
    canvas.width = width;
    canvas.height = height;

    return canvas;
}

export function hasWebGL() {
    let canvas = document.createElement( "canvas" );
    let gl = canvas.getContext( "webgl" ) || canvas.getContext( "experimental-webgl" );

    const returnValue = !!gl;

    canvas = null;
    gl = null;

    return returnValue;
}
