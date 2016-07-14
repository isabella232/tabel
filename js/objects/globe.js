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

import { SphereBufferGeometry } from "three";
import { VideoTexture, VideoMesh } from "../controllers/videoTexture";

export class Globe extends VideoMesh {
    constructor( videoTexture ) {
        const geometry = new SphereBufferGeometry( 500, 60, 60 );

        if ( ! videoTexture ) {
            videoTexture = new VideoTexture( "videoPath", 4096, 2048, "video_file_process", true );
        }

        super( geometry, videoTexture );

        // final film assets shifted the center point of the
        // equirectangular video. To adjust we rotate the Globe
        // instead of changing all the tracking.
        this.rotateY( Math.PI );
    }

    start() {
        this.videoTexture.time = 0;
        this.play();
    }

    adjustVertices( min, max ) {
        const uv = this.geometry.attributes.uv.array;
        const difference = max - min;

        for ( let i = 1; i < uv.length; i += 2 ) {
            uv[ i ] = min + difference * uv[ i ];
        }

        this.uvsNeedUpdate = true;
    }
}

export class StereoGlobe extends Globe {

    constructor() {

        const videoTexture = new VideoTexture(
            "videoStereoPath",
            4096, 4096,
            "video_file_process",
            true
        );

        super( videoTexture );

        this.adjustVertices( 0, 0.5 );

        this.addRightEye( videoTexture );
    }

    addRightEye( texture ) {

        const right = new Globe( texture );

        right.adjustVertices( 0.5, 1 );
        right.layers.set( 2 );

        this.add( right );
    }
}
