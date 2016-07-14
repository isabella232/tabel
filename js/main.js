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

import { h, render, Component } from "preact";

import { Navigation } from "./components/navigation";
import { Footer } from "./components/footer";
import { Film } from "./components/film";
import { Cast } from "./components/cast";
import { Tech } from "./components/tech";
import { About } from "./components/about";
import { Credits } from "./components/credits";
import { Player } from "./components/player";
import { Faq } from "./components/faq";
import { MakingOf } from "./components/making-of";

import { get, bindStateToModel } from "./model";
import { attachRouter } from "./controllers/router";
import { loadImages } from "./controllers/loadManager";
import { set } from "./model";
import { delay } from "./utils/functional";
import { hasWebGL } from "./utils/graphics";
import { addMobileHover } from "./utils/dom";

class AppComponent extends Component {
    constructor() {
        if ( ! hasWebGL() ) window.location = "/no-webgl";

        super();

        attachRouter();
        addMobileHover();

        this.state.section = get( "section" );

        window.addEventListener( "resize", () => set( "stageHeight", window.innerHeight ) );
        window.scrollTo( 0, 0 );
    }

    componentWillMount() {
        bindStateToModel( this, "section" );

        loadImages( get( "preloadImages" ) )
            .then( delay( 4000 ) )
            .then( () => set( "init", true ) );
    }

    getComponent() {
        switch( this.state.section ) {
            case "about" : return <About />;
            case "cast": return <Cast />;
            case "tech": return <Tech />;
            case "credits": return <Credits />;
            case "film": return <Film />;
            case "play": return <Player />;
            case "faq": return <Faq />;
            case "making of": return <MakingOf />;
        }

        return null;
    }

    render() {
        return (
            <div id="container">
                { this.getComponent() }

                <Navigation />
                <Footer />
            </div>
        );
    }
}

render( <AppComponent />, document.body );
