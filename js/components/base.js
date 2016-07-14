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
import { bindStateToModel } from "../model";
import { vent } from "../vent";
import normalizeWheel from "../../third_party/js/normalizeWheel";
import bindAll from "mout/object/bindAll";
import clamp from "mout/math/clamp";
import sign from "mout/number/sign";
import debounce from "mout/function/debounce";

const WHEEL_EVENT = document.onmousewheel !== undefined ? "mousewheel" : "DOMMouseScroll";

export class UtilComponent extends Component {

    constructor() {
        super();

        bindAll( this, "removeClass", "addClass" );
    }

    removeClass( ...classes ) {
        this.base && this.base.classList.remove( ...classes );
    }

    addClass( ...classes ) {
        this.base && this.base.classList.add( ...classes );
    }
}

export class BaseComponent extends UtilComponent {
    constructor() {
        super();

        bindAll( this, "onClearSection" );

        this.bindings = { stageHeight: "stageHeight" };
    }

    componentWillMount() {
        this.hooks = [];

        for ( var key in this.bindings ) {
            this.hooks.push( bindStateToModel( this, key, this.bindings[ key ] ) );
        }

        vent.on( "clear_section", this.onClearSection );

    }

    componentDidMount() {
        this.base.classList.add( "animate-in" );

        setTimeout( this.addClass, 100, "before" );
        setTimeout( this.removeClass, 100, "animate-in" );
        setTimeout( () => {
            this.addClass( "idle" );
            this.removeClass( "before" );
        }, 1000 );
    }

    onClearSection() {
        this.base.classList.add( "animate-out" );
    }

    componentWillUnmount() {
        this.hooks.forEach( ( hook ) => hook.remove() );
        this.hooks = null;

        vent.removeListener( "clear_section", this.onClearSection );

        this.base.classList.remove( "idle", "before", "animate-in", "animate-out" );
    }
}

export class ScrollComponent extends BaseComponent {
    constructor() {
        super();

        this.onContainerResize = debounce( this.onContainerResize, 300 );

        bindAll(
            this,
            "onTouchStart",
            "onTouchMove",
            "onTouchEnd",
            "moveContainer",
            "onMouseWheel",
            "velocityLoop",
            "onContainerResize"
        );

        this.position = 0;
        this.delta = 0;
        this.state.scrollY = 0;
    }

    componentDidMount() {
        super.componentDidMount();

        this.container = document.getElementById( "container" );
        this.container.addEventListener( "touchstart", this.onTouchStart );
        this.container.addEventListener( "touchmove", this.onTouchMove );
        this.container.addEventListener( "touchend", this.onTouchEnd );

        window.addEventListener( WHEEL_EVENT, this.onMouseWheel );
        window.addEventListener( "resize", this.onContainerResize );

        this.onContainerResize();
    }

    onContainerResize() {
        this.maxHeight = Math.max( this.base.getBoundingClientRect().height - window.innerHeight, 0 );
        this.delta = 0;
        this.moveContainer( 0 );
    }

    onTouchStart( event ) {
        window.cancelAnimationFrame( this.raf );

        this.finger = event.touches[ 0 ].pageY;
        this.delta = 0;

        event.stopPropagation();
    }

    onTouchMove( event ) {
        const y = event.touches[ 0 ].pageY;

        this.delta = y - this.finger;
        this.finger = y;

        this.moveContainer( this.delta );

        if ( this.position !== 0 ) event.preventDefault();

        event.stopPropagation();
    }

    onTouchEnd() {
        this.raf = window.requestAnimationFrame( this.velocityLoop );
    }

    onMouseWheel( event ) {
        var values = normalizeWheel( event );
        this.moveContainer( - values.pixelY );
    }

    moveContainer( delta ) {
        this.position += delta;
        this.position = clamp( this.position, - this.maxHeight, 0 );

        this.setState( { scrollY: - this.position } );
    }

    velocityLoop() {
        const prefix = sign( this.delta );
        this.delta = Math.max( Math.abs( this.delta ) - 1, 0 ) * prefix;

        if ( this.delta !== 0 ) {
            this.moveContainer( this.delta );
            this.raf = window.requestAnimationFrame( this.velocityLoop );
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        window.removeEventListener( WHEEL_EVENT, this.onMouseWheel );
        window.removeEventListener( "resize", this.onContainerResize );
        window.cancelAnimationFrame( this.raf );

        this.container.removeEventListener( "touchstart", this.onTouchStart );
        this.container.removeEventListener( "touchmove", this.onTouchMove );

        delete this.container;
    }

    render( props, state ) {
        return (
            <div class="wrapper" style={ `transform: translate3d( 0, ${ - state.scrollY }px, 0 )` }>
                { this.renderContent( props, state ) }
            </div>
        );
    }
}
