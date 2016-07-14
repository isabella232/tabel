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

import { vent } from "../vent";
import { bindAll } from "mout/object";
import { EventEmitter } from "events";
import { get, set } from "../model";

class LoadingController extends EventEmitter {
    constructor() {
        super();

        bindAll( this,
            "onAudioFileLoaded",
            "onAudioFileDecoded",
            "onVideoFileProcess",
            "onTitleFileProcess"
        );

        this.audioLoaded = 0;
        this.audioDecoded= 0;
        this.videoLoaded = 0;
        this.titleLoaded = 0;
        this.audioFilesAmount = get( "audioChannels" );

        vent.on( "audio_file_loaded", this.onAudioFileLoaded );
        vent.on( "audio_file_decoded", this.onAudioFileDecoded );
        vent.on( "video_file_process", this.onVideoFileProcess );
        vent.on( "title_file_process", this.onTitleFileProcess );
    }

    onAudioFileLoaded() {
        this.audioLoaded += 1 / this.audioFilesAmount;
        this.update();
    }

    onAudioFileDecoded() {
        this.audioDecoded += 1 / this.audioFilesAmount;
        this.update();
    }

    onVideoFileProcess( percent ) {
        this.videoLoaded = percent;
        this.update();
    }

    onTitleFileProcess( percent ) {
        this.titleLoaded = percent;
        this.update();
    }

    update() {
        const all = (
            this.audioLoaded +
            this.audioDecoded +
            this.videoLoaded +
            this.titleLoaded
        ) / 4;

        set( "preloaded", Math.min( all, 1 ) );
    }
}

export function loadImage( path ) {
    return new Promise( function( resolve ) {
        const image = new Image();

        image.onload = () => resolve( image );
        image.src = path;
    } );
}

export function loadImages( images ) {
    return Promise.all( images.map( loadImage ) );
}

export const loadManager = new LoadingController();
