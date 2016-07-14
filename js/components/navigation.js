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
import { get, set } from "../model";
import { makeTitle } from "../utils/ui";
import { BaseComponent } from "./base";
import { bindAll } from "mout/object";
import { findInParent } from "../utils/functional";

export class Navigation extends BaseComponent {

    constructor() {
        super();

        bindAll( this, "onMenuClick", "onLogoClick", "onMobileClick" );

        this.names = [ "film", "about", "cast", "tech", "credits", "faq", "making of" ];
        this.state.selected = get( "section" );
        this.state.hidden = get( "menuHidden" );
        this.state.pageReady = get( "init" );
        this.state.open = false;

        this.bindings.selected = "section";
        this.bindings.hidden = "menuHidden";
        this.bindings.pageReady = "init";
    }

    onMenuClick( event ) {
        const section = findInParent( event.target, "data-name", 3 );

        if ( ! section ) return;

        this.setState( { open: false, selected: section } );
        set( "route", section );
    }

    onLogoClick() {
        this.setState( { open: false } );
        set( "route", "film" );
    }

    onMobileClick() {
        this.setState( { open: ! this.state.open } );
    }

    render() {
        return (
            <nav class={
                ( this.state.open ? " open" : "" ) +
                ( this.state.hidden ? " hidden" : "" ) +
                ( this.state.pageReady ? "" : " hidden" )
            }>
                <span id="logo" data-name="film" onClick={ this.onLogoClick }>{ makeTitle( "TABEL", true ) }</span>
                <ul class="menu" onClick={ this.onMenuClick }>
                    { this.names.map( ( name ) => {
                        const klass = name === this.state.selected ? "selected" : "";

                        return (
                            <li data-name={ name } class={ klass }>
                                <div class="navigation-text">
                                    { name.toUpperCase().split( "" ).map( function( letter ) {
                                        return <span>{ letter }</span>;
                                    } ) }
                                </div>
                            </li>
                        );
                    } ) }
                </ul>

                <div class="mobile-button" onClick={ this.onMobileClick }>
                    <div class="line line-1"></div>
                    <div class="line line-2"></div>
                    <div class="line line-3"></div>
                </div>
            </nav>
        );
    }
}


// <ul class="social">
//     <li class="facebook"><a href="https://facebook.com">Facebook</a></li>
//     <li class="twitter"><a href="https://twitter.com">Twitter</a></li>
//     <li class="gplus"><a href="https://plus.google.com">Google Plus</a></li>
// </ul>