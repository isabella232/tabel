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

import { h, Component } from "preact";

export class CircleLoader extends Component {

    componentDidUpdate() {

        const context = this.canvas.getContext( "2d" );

        this.canvas.width = 50;
        this.canvas.height = 50;

        this.drawCircle( context, 0.3, 1 );
        this.drawCircle( context, 1, Math.max( this.props.percent, 0.01 ) );
    }

    componentDidMount() {
        this.componentDidUpdate();
    }

    drawCircle( context, opacity, amount ) {
        if ( ! context ) return;

        context.beginPath();
        context.moveTo( 48, 25 );
        context.arc( 25, 25, 23, 0, Math.PI * 2 * amount );
        context.lineWidth = 3;
        context.strokeStyle = "rgba( 255, 255, 255, " + opacity + " )";
        context.stroke();
    }

    render() {
        return (
            <div class="play circle-loader">
                { Math.round( this.props.percent * 100 ) }
                <canvas ref={ ( dom ) => this.canvas = dom }></canvas>
            </div>
        );
    }
}