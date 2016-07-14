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
import { map } from "../utils/functional";
import { nextBlock, lastBlock } from "../utils/ui";

export class Credits extends ScrollComponent {

    constructor() {
        super();

        this.cast = {
            "Waiter": "Mario Quesada",
            "Critic": "Gys De Villiers",
            "Husband": "Nick Giedris",
            "Wife": "Rainbow Geffner",
            "Capitalist": "Heather Girardi",
            "Idealist": "Nick Piacente",
            "Activist DJ": "Tania Asnes",
            "Engineer": "Lya Yanne",
            "Architect": "Lakshmi Devy",
            "Interior Designer": "Graciany Miranda",
            "Little Girl": "Saige Hocke",
            "Background Waiters": "Erinn Springer",
            "": "Mark Pizzi"
        };

        // Pairs are in reverse beceause there is several of the same
        // job title. That would create identical object keys, which is
        // not allowed in JS.
        this.crew = {
            "Eric Tao": "Jump Odyssey Technician",
            "Ryan Helfant": "Director of Photography",
            "Eugene Choi": "Art Director",
            "Ian Bauer": "Digital Creative Director",
            "Josh Ridley": "Production Manager",
            "Erica Palgon Casting": "Casting",
            "Adam Grass": "Lead Audio Mixer",
            "Ethan Goldberger": "Audio Mixer",
            "Sergio Fernandez": "AC / G&E",
            "Caitlin Dooley": "Wardrobe",
            "Elenita Fabre-Dodia": "Wardrobe Assistant",
            "Adriana Andaluz": "Hair and Makeup",
            "Gloria Espinoza": "Hair and Makeup Assistant",
            "Zuzu Snyder": "Set Decorator",
            "Michael Cummings": "Props",
            "Mu Gadu": "Prop Assistant",
            "Rubes Harman": "Food Stylist",
            "Gavin Rosenberg": "Editorial and Color",
            "Pomann Sound": "Audio Post Facility",
            "Bob Pomann": "VR Sound Producer",
            "Justin Kaupp": "Dialogue Mix and Sound Design",
            "Claudio Santos": "Spatial Audio Supervisor",
            "Erinn Springer": "On Set Photographer",
            "Mark Pizzi": "Production Assistant",
            "Will Adamy": "Production Assistant",
            "Dusha Holmes": "Production Assistant",
            "Miles Maxwell": "Production Assistant",
            "Mason Premiere": "Location"
        };
    }

    renderContent( props, { stageHeight } ) {
        return (
            <div id="credits" class="section" style={ "min-height: " + stageHeight + "px" }>
                <Title text="CREDITS" />

                <h3 class={ nextBlock() }>VR Concept and Project Directors</h3>

                <div class={ nextBlock() }>
                    <div class="line"><div class="key">Alexis Cox</div></div>
                    <div class="line"><div class="key">Marcel Baker</div></div>
                </div>

                <h3 class={ nextBlock() }>Film Director</h3>

                <div class={ "line " + nextBlock() }><div class="key">Billy Silva</div></div>

                <h3 class={ nextBlock() }>Principal Engineer</h3>

                <div class={ "line " + nextBlock() }><div class="key">Mathias Paumgarten</div></div>

                <h3 class={ nextBlock() }>Written by</h3>

                <div class={ nextBlock() }>
                    <div class="line"><div class="key">Lucy Teitler</div></div>
                    <div class="line"><div class="key">Billy Silva</div></div>
                    <div class="line"><div class="key">Alexis Cox</div></div>
                    <div class="line"><div class="key">Marcel Baker</div></div>
                </div>

                <h3 class={ nextBlock() }>Produced by</h3>

                <div class={ nextBlock() }>
                    <div class="line"><div class="key">Ray Klonsky</div></div>
                    <div class="line"><div class="key">Eric Tao</div></div>
                </div>

                <h3 class={ nextBlock() }>Cast</h3>

                <div class={ nextBlock() }>
                    { map( this.cast, ( key ) => {
                        return (
                            <div class="line">
                                <div class="key">{ key.toUpperCase() }</div>
                                <div class="value">{ this.cast[ key ] }</div>
                            </div>
                        );
                    } ) }
                </div>

                <h3 class={ nextBlock() }>Crew</h3>

                <div class={ lastBlock() }>
                    { map( this.crew, ( key ) => {
                        return (
                            <div class="line">
                                <div class="key">{ this.crew[ key ].toUpperCase() }</div>
                                <div class="value">{ key }</div>
                            </div>
                        );
                    } ) }
                </div>
            </div>
        );
    }
}
