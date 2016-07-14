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

import { vent } from "./vent";

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
);

export const bucketURL = "https://storage.googleapis.com/gweb-acc-tabelverity-prod.appspot.com/";
export const localURL = "http://localhost:8081/";

// Set this url to bucketURL to load remote assets. This only applies to videos and audio files.
const assetBasePath = bucketURL;

const cache = {

    // state of basic initiation
    init: false,

    // current route
    route: "",

    // route of the page
    section: "film",

    // all accessable way to hide menu
    menuHidden: false,

    // images to load before the page shows
    preloadImages: [
        "/static/images/background.jpg",
        "/static/images/background-mobile.jpg",
        "/static/images/tablet.png",
        "/static/images/making-of-panorama.jpg"
    ],

    // paths to all sound files
    audioPaths: [
        assetBasePath + "mp3/waiter-child.mp3",
        assetBasePath + "mp3/architect.mp3",
        assetBasePath + "mp3/business.mp3",
        assetBasePath + "mp3/critic.mp3",
        assetBasePath + "mp3/dj.mp3",
        assetBasePath + "mp3/mayor.mp3",
        assetBasePath + "mp3/music.mp3"
    ],

    // paths to all sounds used on mobile
    mobileAudioPaths: [
        assetBasePath + "mp3/critic-mobile.mp3",
        assetBasePath + "mp3/business-mobile.mp3",
        assetBasePath + "mp3/dj-mobile.mp3",
        assetBasePath + "mp3/architect-mobile.mp3",
        assetBasePath + "mp3/mayor-mobile.mp3"
    ],

    // amount of audio files to be loaded. Shorthand used by the load manager.
    audioChannels: isMobile ? 5 : 7,

    // path to video file
    videoPath: {
        webm: assetBasePath + "webm/scene-2.webm",
        mp4: isMobile ?
            assetBasePath + "mp4/mobile-2.mp4" :
            assetBasePath + "mp4/scene.mp4"
    },

    videoStereoPath: {
        mp4: assetBasePath + "mp4/scene-stereo-mobile.mp4",
        webm: assetBasePath + "mp4/scene-stereo.webm"
    },

    // path to video of title cards
    titlePath: {
        webm: assetBasePath + "webm/title.webm",
        mp4: assetBasePath + "mp4/title.mp4"
    },

    // how much of the experience has been loaded
    preloaded: 0,

    // height of browser
    stageHeight: window.innerHeight,

    // determine if the device is mobile
    isMobile: isMobile,

    // determines if current device is iDevice
    isIPhone: /iPhone|iPad|iPod/i.test( navigator.userAgent ),

    // determine if browser is safari
    isSafari: /^((?!chrome|android).)*safari/i.test( navigator.userAgent ),

    // determine if browser is IE (not Edge)
    isIE: /MSIE|Trident/i.test( navigator.userAgent ),

    // delays in Milliseconds between the updating of the audio positions
    audioUpdateRate: isMobile ? 100 : 40
};

export function set( name, value ) {
    let oldValue = cache[ name ];

    if ( value === oldValue ) return;

    cache[ name ] = value;

    vent.emit( "model:" + name, value, oldValue );
}

export function get( name ) {
    return cache[ name ];
}

export function bindStateToModel( component, stateName, modelName ) {

    if ( modelName === undefined ) {
        modelName = stateName;
    }

    const callback = function( value ) {
        component.setState( { [ stateName ]: value } );
    };

    vent.on( "model:" + modelName, callback );

    component.setState( { [ stateName ]: get( modelName ) } );

    return {
        remove: () => vent.removeListener( "model:" + modelName, callback )
    };
}
