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

import { Vector3 } from "three";
import { fromTo } from "../utils/math";

const zero = new Vector3();

class TrackingVector extends Vector3 {

    constructor( x, y, z ) {
        super( x, y, z );

        this.reversed = fromTo( this, zero );
    }

    setTime() {}
}

class MovingVector extends Vector3 {

    constructor( values ) {
        super();

        this.times = values;
        this.maxIndex = this.times.length - 1;
        this.reversed = new Vector3();

        this.setTime( 0 );
    }

    setTime( seconds ) {

        let index = 0;
        let current = this.times[ 0 ];

        while ( index + 1 <= this.maxIndex && this.times[ index + 1 ].time < seconds ) {
            current = this.times[ ++index ];
        }

        if ( index === this.maxIndex ) this.copy( current.vector );
        else {
            const next = this.times[ index + 1 ];
            const percent = ( seconds - current.time ) / ( next.time - current.time );

            this.copy( current.vector );
            this.lerp( next.vector, percent );
        }

        fromTo( this, zero, this.reversed );
    }
}

class IdealistVector extends MovingVector {

    constructor() {
        super( [
            { time: 0, vector: new Vector3( 0.8634334842916724, -0.15643445966714145, -0.47959449333013804 ) },
            { time: 347, vector: new Vector3( 0.8634334842916724, -0.15643445966714145, -0.47959449333013804 ) },
            { time: 350.5, vector: new Vector3( -0.6209214953533205, -0.05407881446865413, -0.782005101283784 ) },
            { time: 353.5, vector: new Vector3( -0.6209214953533205, -0.05407881446865413, -0.782005101283784 ) },
            { time: 354.5, vector: new Vector3( -0.8719424887412593, -0.17364818278905964, 0.45778008360101 ) }
        ] );
    }
}

class WaiterVector extends MovingVector {

    constructor() {
        super( [
            { time: 0, vector: new Vector3( -0.986831669596431, 0.006981260113224153, -0.16159986970524384 ) },
            { time: 91, vector: new Vector3( -0.986831669596431, 0.006981260113224153, -0.16159986970524384 ) },
            { time: 94, vector: new Vector3( 0.363555306455572, 0.18223552125025036, -0.9135741644456922 ) },
            { time: 140.5, vector: new Vector3( 0.363555306455572, 0.18223552125025036, -0.9135741644456922 ) },
            { time: 145, vector: new Vector3( -0.9345195827374516, 0.07671903127274883, 0.3475447305323308 ) },
            { time: 168, vector: new Vector3( -0.9345195827374516, 0.07671903127274883, 0.3475447305323308 ) },
            { time: 174, vector: new Vector3( 0.7352020010830159, 0.07497872430076327, 0.6736885099998063 ) },
            { time: 186, vector: new Vector3( 0.2700508569410623, 0.10105629627928914, -0.9575281508382457 ) },
            { time: 187, vector: new Vector3( 0.2700508569410623, 0.10105629627928914, -0.9575281508382457 ) },
            { time: 191, vector: new Vector3( -0.524510481909905, 0.10973430865325068, -0.844302751310827 ) },
            { time: 196.5, vector: new Vector3( -0.9526252067551364, 0.008726535519971207, 0.3040214844917252 ) },
            { time: 226, vector: new Vector3( -0.9526252067551364, 0.008726535519971207, 0.3040214844917252 ) },
            { time: 233, vector: new Vector3( -0.9725732715736521, 6.123234014638032e-17, -0.23259671412236887 ) },
            { time: 273, vector: new Vector3( -0.9562523202675197, -0.01047178448755617, -0.29235567672380025 ) },
            { time: 276, vector: new Vector3( -0.9562523202675197, -0.01047178448755617, -0.29235567672380025 ) },
            { time: 280, vector: new Vector3( 0.23331701904132604, -0.03315517781309402, -0.9718353270023947 ) },
            { time: 285, vector: new Vector3( 0.23331701904132604, -0.03315517781309402, -0.9718353270023947 ) },
            { time: 310, vector: new Vector3( -0.9026075592916037, 0.04013179381105394, 0.42858958577543715 ) },
            { time: 329, vector: new Vector3( -0.9026075592916037, 0.04013179381105394, 0.42858958577543715 ) },
            { time: 333, vector: new Vector3( -0.9976459959519282, -0.01396218022427512, -0.06713809860630854 ) }
        ] );
    }
}

const vectors = {
    waiter: new WaiterVector(),
    idealist: new IdealistVector(),
    fire: new TrackingVector( -0.9946246353293483, 0.022687333366708543, -0.10103029100556328 ),
    engineers: new TrackingVector( 0.9177862390726723, 0.02617694820528461, -0.39621103814949094 ),
    business: new TrackingVector( -0.5188960651145118, -0.10452846340372506, -0.8484224619534376 ),
    critic: new TrackingVector( -0.8719424887412593, -0.17364818278905964, 0.45778008360101 ),
    dj: new TrackingVector( 0.2573158152102382, 0.0714974470825194, -0.9636787256671036 ),
    mayor: new TrackingVector( 0.7638876485199515, -0.0645323091898272, 0.6421146638329382 )
};

const mobileVectors = [
    new TrackingVector( -0.8719424887412593, -0.17364818278905964, 0.45778008360101 ),
    new TrackingVector( -0.5188960651145118, -0.10452846340372506, -0.8484224619534376 ),
    new TrackingVector( 0.2573158152102382, 0.0714974470825194, -0.9636787256671036 ),
    new TrackingVector( 0.9177862390726723, 0.02617694820528461, -0.39621103814949094 ),
    new TrackingVector( 0.7638876485199515, -0.0645323091898272, 0.6421146638329382 )
];

export function getLocationVector( person ) {
    return vectors[ person ];
}

export function getMobileLocationVector( index ) {
    return mobileVectors[ index ];
}
