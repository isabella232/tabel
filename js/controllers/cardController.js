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

import { PlaneBufferGeometry, Vector3, MeshBasicMaterial, Mesh, FrontSide, Texture } from "three";
import { VideoTexture, VideoMesh, CostumEvent } from "./videoTexture";
import { loadImages } from "./loadManager";
import { get } from "../model";

const zero = new Vector3();
const blackMaterial = new MeshBasicMaterial( { color: 0, side: FrontSide } );

export function getTitleCardPlayerClass() {
    if ( get( "isMobile" ) ) return ImageCardPlayer;
    else return TitleCardPlayer;
}

export class ImageCardPlayer extends Mesh {
    constructor() {
        const texture = new Texture( new Image() );
        const geometry = new PlaneBufferGeometry( 16, 8 );
        const material = new MeshBasicMaterial( { map: texture, side: FrontSide } );

        super( geometry, material );

        this.texture = texture;

        this.currentSlot = -1;
        this.slots = [
            [ 1, 9 ],
            [ 13, 16 ],
            [ 243, 253 ],
            [ 458, 460 ],
            [ 461, 463 ],
            [ 464, 466 ],
            [ 467, 469 ],
            [ 469, 471 ]
        ];

        const backdrop = new Mesh( geometry, blackMaterial );
        backdrop.scale.set( 5, 5, 5 );
        backdrop.position.set( 0, 0, -1 );
        backdrop.layers.enable( 2 );

        this.add( backdrop );

        this.layers.enable( 2 );

        window.addEventListener( "orientationchange", this.onOrientationChange.bind( this ) );

        this.onOrientationChange();
    }

    onOrientationChange() {
        if ( window.orientation === 0 ) this.scale.set( 0.6, 0.6, 1 );
        else this.scale.set( 1, 1, 1 );
    }

    getSlot( time ) {
        for ( let i = 0; i < 8; i++ ) {
            if ( time >= this.slots[ i ][ 0 ] && time <= this.slots[ i ][ 1 ] ) return i;
        }

        return -1;
    }

    update( time ) {

        const slot = this.getSlot( time );

        if ( this.currentSlot === slot ) return;

        if ( slot > -1 ) {
            this.texture.image = this.images[ slot ];
            this.texture.needsUpdate = true;
        }

        if ( this.currentSlot === -1 && slot > -1 ) {
            ( ! this.parent ) && this.scene.add( this );
        } else if ( this.currentSlot > -1 && slot === -1 ) {
            this.parent && this.scene.remove( this );
        }

        this.currentSlot = slot;
    }

    load() {
        this.images = [];

        const paths = [
            "/static/images/title-1.jpg",
            "/static/images/title-2.jpg",
            "/static/images/title-3.jpg",
            "/static/images/title-4.jpg",
            "/static/images/title-5.jpg",
            "/static/images/title-6.jpg",
            "/static/images/title-7.jpg",
            "/static/images/title-8.jpg"
        ];

        loadImages( paths )
            .then( ( images ) => {
                this.texture.image = images[ 0 ];
                this.texture.needsUpdate = true;
                this.images = images;
                this.dispatchEvent( new CostumEvent( "ready" ) );
            } );
    }

    updateCamera( target, camera ) {
        this.position.copy( target ).setLength( 10 );
        this.rotation.copy( camera.rotation );
    }

    // Stub out some functions that are called from the
    // controller but have no effect when used as images
    play() {}
    pause() {}
    stop() {}
}

export class TitleCardPlayer extends VideoMesh {

    constructor() {
        const geometry = new PlaneBufferGeometry( 16, 8 );
        const videoTexture = new VideoTexture( "titlePath", 2048, 1024, "title_file_process" );

        super( geometry, videoTexture );

        this.currentSlot = -1;
        this.slots = [
            [ 0, 15 ],
            [ 243, 253 ],
            [ 459, 470 ]
        ];

        this.slotMapping = [
            [ 0, 15 ],
            [ 23, 32 ],
            [ 36, 46 ]
        ];

        const backdrop = new Mesh( geometry, blackMaterial );
        backdrop.scale.set( 5, 5, 5 );
        backdrop.position.set( 0, 0, -1 );
        backdrop.layers.enable( 2 );

        this.layers.enable( 2 );
        this.add( backdrop );
    }

    testSlot( time ) {
        for ( let i = 0; i < 3; i++ ) {
            if ( time >= this.slots[ i ][ 0 ] && time <= this.slots[ i ][ 1 ] ) return i;
        }
        return -1;
    }

    getMappedTime( time, slot ) {
        const originalSlot = this.slots[ slot ];
        const mapSlot = this.slotMapping[ slot ];

        const percent = ( time - originalSlot[ 0 ] ) / ( originalSlot[ 1 ] - originalSlot[ 0 ] );

        return mapSlot[ 0 ] + percent * ( mapSlot[ 1 ] - mapSlot[ 0 ] );
    }

    update( time ) {
        super.update();

        let slot = this.testSlot( time );

        if ( this.currentSlot !== slot ) {

            if ( slot === -1 ) {
                this.time = this.slotMapping[ ( this.currentSlot + 1 ) % 3 ][ 0 ];
                this.pause();
                this.parent && this.scene.remove( this );
            } else if ( slot > -1 ) {
                this.play();
                this.time = this.getMappedTime( time, slot );
                ( ! this.parent ) && this.scene.add( this );
            }
        } else if ( this.currentSlot > -1 && ! this.isPlaying ) {
            this.time = this.getMappedTime( time, slot );
            this.play();
        }

        this.currentSlot = slot;
    }

    updateCamera( target ) {
        this.position.copy( target ).setLength( 10 );
        this.lookAt( zero );
    }
}
