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
import { ScrollComponent } from "./base";
import { Title } from "./title";
import { makeCircleText } from "../utils/ui";
import { take } from "mout/array";
import { bindAll } from "mout/object";
import { Vector2 } from "three";
import { nextBlock, lastBlock, resetBlocks } from "../utils/ui";

export class Tech extends ScrollComponent {

    constructor() {
        super();

        bindAll( this, "onMouseMove", "onEnterFrame" );

        this.mouse = new Vector2();
        this.raf = null;
    }

    getDomLocation( element ) {
        const { left, top, width, height } = element.getBoundingClientRect();

        return new Vector2( left + width / 2, top + height / 2 );
    }

    componentDidMount() {
        super.componentDidMount();
        window.addEventListener( "mousemove", this.onMouseMove );

        setTimeout( () => {
            this.rotator1Location = this.getDomLocation( this.rotator1 );
            this.rotator2Location = this.getDomLocation( this.rotator2 );
            this.raf = requestAnimationFrame( this.onEnterFrame );
            this.rotator1.style.opacity = 1;
            this.rotator2.style.opacity = 2;
        }, 1000 );
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        window.removeEventListener( "mousemove", this.onMouseMove );
        cancelAnimationFrame( this.raf );

        this.rotator1.style.transform = "";
        this.rotator2.style.transform = "";
    }

    onMouseMove( event ) {
        this.mouse.set( event.pageX, event.pageY );
    }

    onEnterFrame() {
        this.setRotation( "rotator1" );
        this.setRotation( "rotator2" );

        this.raf = requestAnimationFrame( this.onEnterFrame );
    }

    setRotation( name ) {
        const vector = new Vector2().subVectors( this[ name + "Location" ], this.mouse );
        const rotation = Math.atan2( vector.y, vector.x );

        this[ name ].style.transform = "rotate(" + ( rotation + Math.PI * 1.25 ) + "rad)";
    }

    renderContent( props, { stageHeight } ) {
        return (
            <div id="tech" class="section" style={ "min-height: " + stageHeight + "px" }>
                <Title text="Technology" />

                { resetBlocks( 1 ) }

                <p class={ nextBlock() }>
                    This film uses 6 channels of high fidelity 360 directional audio
                    that enables the viewer to hear different audio experiences
                    based on the viewer’s point-of-view.
                </p>

                <div class="holder">
                    <div class="table">
                        <div class={ "column " + nextBlock() }>
                            <div class="title">Camera Setup</div>
                            <div class="circle camera">
                                <div class="center camera"></div>
                                { makeCircleText( "table placement" ) }

                                { take( 6, ( i ) => <div class={ "table table-" + ( i + 1 ) }>{ ( i + 1 ) }</div> ) }
                            </div>
                        </div>

                        <div class={ "column " + nextBlock() }>
                            <div class="title">360 Audio Channels</div>
                            <div class="circle audio">
                                <div class="rotator" ref={ dom => this.rotator1 = dom }>
                                    <div class="cover-1"></div>
                                    <div class="cover-2"></div>
                                </div>
                                <div class="border"></div>

                                <div class="center audio"></div>
                                { makeCircleText( "9 audio channels" ) }
                            </div>
                        </div>

                        <div class={ "column " + lastBlock() }>
                            <div class="title">360 Video Channels</div>
                            <div class="circle video">
                                <div class="rotator" ref={ dom => this.rotator2 = dom }>
                                    <div class="cover-1"></div>
                                    <div class="cover-2"></div>
                                </div>
                                <div class="border"></div>

                                <div class="center video"></div>
                                { makeCircleText( "16 cameras" ) }

                                <div class="inner-circle"></div>

                                { take( 16, ( i ) => <div class={ "line line-" + ( i + 1 ) }></div> ) }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}