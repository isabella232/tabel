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

import { Component, h } from "preact";
import bindAll from "mout/object/bindAll";
import debounce from "mout/function/debounce";
import { getTopOffset } from "../utils/dom";

export class StaticImage extends Component {

    constructor() {
        super();

        this.state.width = window.innerWidth;
        this.state.height = window.innerHeight;

        this.calculate = debounce( this.calculate, 200, false );

        bindAll( this, "calculate", "onResize" );
    }

    componentWillMount() {
        this.setState( {
            width: window.innerWidth,
            height: window.innerHeight
        } );

        window.addEventListener( "resize", this.onResize );
    }

    componentDidMount() {
        this.setState( { left: this.base.getBoundingClientRect().left } );
        this.calculate();
    }

    componentWillUnmount() {
        window.removeEventListener( "resize", this.onResize );
    }

    calculate() {
        this.offset = getTopOffset( this.base );
    }

    onResize() {
        this.setState( {
            width: window.innerWidth,
            height: window.innerHeight
        } );

        this.calculate();
    }

    render( { src, classes, scrollY }, {  width, height, left } ) {

        return (
            <div
                class={ "static-image" }
                style={ "width:" + width + "px;height:" + height + "px;left:" + ( - left ) + "px" }>

                <div
                    class="static-image-inner"
                    style={ "background-image:url(" + src + ");transform:translate3d(0, " + ( - this.offset + scrollY ) + "px, 0 )" }></div>
            </div>
        );
    }
}

export class StaticVideo extends StaticImage {

    componentDidMount() {
        super.componentDidMount();

        setTimeout( () => {
            try {
                this.base.querySelector( "video" ).play();
            } catch( excpection ) {
                // we will get an exception in two cases.
                // it can't find video because it has been unmounted or
                // if play has been called and it hasn't started yet.
                // The quickest way was to catch both of them
            }
        }, 2000 );
    }

    render( { src, classes, scrollY }, {  width, height, left } ) {
        return (
            <div class={ "static-image" }
                style={ "width:" + width + "px;height:" + height + "px;left:" + ( - left ) + "px" }>

                <video loop autoplay muted class="static-video-inner"
                    style={ "transform:translate3d(0, " + ( - this.offset + scrollY ) + "px, 0 )" }>

                    <source type="video/mp4" src={ src } />
                </video>
            </div>
        );
    }
}