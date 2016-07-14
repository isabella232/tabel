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

import { h } from "preact";

const oswaldBold = "oswald-bold";
const oswaldRegular = "oswald-regular";
const vidalokaRegular = "vidaloka-regular";

const matchings = {
    "a": vidalokaRegular,
    "b": oswaldRegular,
    "c": oswaldRegular,
    "d": vidalokaRegular,
    "e": oswaldBold,
    "f": oswaldBold,
    "g": vidalokaRegular,
    "h": vidalokaRegular,
    "i": vidalokaRegular,
    "j": oswaldRegular,
    "k": oswaldBold,
    "l": vidalokaRegular,
    "m": oswaldRegular,
    "n": oswaldRegular,
    "o": vidalokaRegular,
    "p": vidalokaRegular,
    "q": oswaldBold,
    "r": oswaldRegular,
    "s": oswaldRegular,
    "t": oswaldBold,
    "u": vidalokaRegular,
    "v": vidalokaRegular,
    "w": oswaldRegular,
    "x": "",
    "y": oswaldRegular,
    "z": "",
    "&": vidalokaRegular
};

export function makeTitle( string, large = false ) {
    return string.split( "" ).map( function( char ) {

        if ( char === " " ) return <span class="title-char oswald-bold"> </span>;

        const font = matchings[ char.toLowerCase() ];
        const klass = "title-char none-space " + font + ( large ? " large" : "" );

        if ( font === "" ) console.warn( "no font found for:", char );

        return <span class={ klass }>{ char.toUpperCase() }</span>;
    } );
}

export function makeCircleText( string ) {
    return string.split( "" ).map( ( char, i ) => {
        return <span class={ "char char-" + ( ++i ) }>{ char }</span>;
    } );
}

export function makePlay() {
    return [
        <span class="title-char vidaloka-regular">P</span>,
        <span class="title-char roboto-mono">L</span>,
        <span class="title-char triangle">&nbsp;</span>,
        <span class="title-char roboto-mono">Y</span>
    ];
}

let block = 1;

export function lastBlock() {
    const name = "block block-" + block;
    block = 1;

    return name;
}

export function nextBlock() {
    return "block block-" + ( block++ );
}

export function resetBlocks( value = 1) {
    block = value;
}
