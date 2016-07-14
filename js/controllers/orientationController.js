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

import { Vector2, Vector3, Math as MathUtils } from "three";
import { bindAll } from "mout/object";
import { clamp } from "mout/math";

export class Orientation {

    constructor( camera ) {

        this.target = new Vector3( -1, 0, 0 );
        this.position = new Vector2();
        this.delta = new Vector2();

        this.latitude = 0;
        this.longitude = 180;

        this.camera = camera;

        bindAll( this, "onMouseDown", "onMouseUp", "onMouseMove" );
    }

    reset() {
        this.latitude = 0;
        this.longitude = 180;
        this.hasChanged = true;
    }

    bind() {
        document.addEventListener( "mousedown", this.onMouseDown );
    }

    unbind() {
        document.removeEventListener( "mousedown", this.onMouseDown );
    }

    onMouseDown( event ) {
        event.preventDefault();

        this.position.set( event.pageX, event.pageY );
        this.hasChanged = true;

        document.addEventListener( "mousemove", this.onMouseMove );
        document.addEventListener( "mouseup", this.onMouseUp );
    }

    onMouseMove( event ) {
        this.delta.set( event.pageX, event.pageY ).sub( this.position );

        this.longitude -= this.delta.x * 0.05;
        this.latitude += this.delta.y * 0.1;

        this.position.set( event.pageX, event.pageY );
        this.hasChanged = true;
    }

    onMouseUp() {
        document.removeEventListener( "mousemove", this.onMouseMove );
        document.removeEventListener( "mouseup", this.onMouseMove );
    }

    updateMouseTarget() {
        if ( ! this.hasChanged ) return;

        this.latitude = clamp( this.latitude, -85, 85 );

        this.target.set(
            500 *
                Math.sin( MathUtils.degToRad( 90 - this.latitude ) ) *
                Math.cos( MathUtils.degToRad( this.longitude ) ),
            500 * Math.cos( MathUtils.degToRad( 90 - this.latitude ) ),
            500 *
                Math.sin( MathUtils.degToRad( 90 - this.latitude ) ) *
                Math.sin( MathUtils.degToRad( this.longitude ) )
        );

        this.hasChanged = false;
    }

    update() {
        this.updateMouseTarget();

        this.camera.lookAt( this.target );
    }
}
