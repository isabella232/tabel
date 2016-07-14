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
import { set } from "../model";
import { track } from "./tracking";

let lock = false;

function onPopState( event ) {
    event.preventDefault();
    event.stopImmediatePropagation();

    set( "section", getSection() );
}

function getSection() {
    let section = document.location.pathname.substr( 1 );

    if ( section === "/" || section.length === 0 ) section = "film";

    return section.replace( "-", " " );
}

function onRouteChange( route, previousValue ) {

    if ( route === "film" && ! previousValue && getSection() === "film" ) return;

    if ( lock ) return;

    lock = true;

    set( "previous_section", previousValue );

    if ( route === "play" ) {
        track( "page", "/" + route );
        set( "section", route );
        lock = false;
        return;
    }

    vent.emit( "clear_section" );

    setTimeout( () => {

        window.history.pushState( {}, "", route.replace( " ", "-" ) );

        document.body.scrollTop = 0;
        document.querySelector( "#container" ).scrollTop = 0;

        set( "section", route );
        track( "page", "/" + route );

        lock = false;

    }, 900 );
}

export function attachRouter() {
    vent.on( "model:route", onRouteChange );
    window.addEventListener( "popstate", onPopState );
    onPopState( new Event( "popstate" ) );

    if ( getSection() !== "film" ) set( "init", true );
}
