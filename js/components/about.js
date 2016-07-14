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
import { set } from "../model";
import { Title } from "./title";
import { SmallTitle } from "./small-title";
import { nextBlock, lastBlock } from "../utils/ui";


export class About extends ScrollComponent {

    onLearnMore() {
        set( "route", "tech" );
    }

    renderContent( props, { stageHeight } ) {
        return (
            <div id="about" class="section" style={ "min-height: " + stageHeight + "px" }>
                <Title text="About Tabel"/>

                <SmallTitle klass={ nextBlock() } text="An Allegory About Climate Change" />

                <p class={ nextBlock() }>
                    Tonight is a very special night and you, the viewer are lucky enough to have
                    found a last minute seat at Tabel Restaurant, one of the most exclusive
                    farm-to-table restaurants around. Unfortunately, Tabel has serious problems in
                    the kitchen. The waiter is exceptional at hiding these problems but the
                    influential patrons of the restaurant are slowly catching on to the ripening
                    catastrophe that is so obviously escalating around them. Will anyone take action
                    to save the restaurant and themselves?
                </p>

                <SmallTitle klass={ nextBlock() } text="A Story Written for VR" />

                <p class={ nextBlock() }>
                    Tabel is a story that needs to be digested. It is an experience made for
                    immersive VR. The VR format allows you to taste and absorb the cacophony of
                    characters and storylines, while actively participating in the story itself. As
                    the night progresses, chaos gradually engulfs the restaurant and as smoke
                    billows out of the kitchen, you realize that like the other characters in the
                    story, you have also been sitting back while to the drama unfolds. Tabel is an
                    experience that will be felt personally by you, the viewer, as you are the
                    center of the story itself.
                </p>

                <SmallTitle klass={ nextBlock() } text="An Interactive Audio Experiment" />

                <p class={ nextBlock() }>
                    Tabel is an experiment in VR storytelling that provides you a delectable balance
                    between an interactive and a passive viewing experience using a unique
                    directional audio technique. There are six storylines that unfold simultaneously
                    during the 7 minute film. By looking around, you can choose which stories to
                    listen to by looking in the direction of any character in the film. The
                    directional audio was built specifically for this VR film and Tabel was created
                    and written with this audio technique in mind.&nbsp;
                    <a onClick={ this.onLearnMore.bind( this ) }>Learn&nbsp;More</a>
                </p>

                <h2 class="acc block block-8">Art Copy &amp; Code</h2>

                <p class={ lastBlock() }>
                    This project is an experiment in VR storytelling made by Google as part of the
                    latest series of&nbsp;
                    <a href="https://www.thinkwithgoogle.com/collections/art-copy-code.html"
                       target="_blank">
                        Art, Copy & Code
                    </a>&nbsp;
                    projects. Art, Copy & Code is a Google initiative that explores ways to create
                    and break the rules of digital storytelling mediums. The Tabel VR experience is
                    meant to showcase how VR technology is not only an exciting creative canvas for
                    filmmaking, but also a largely unexplored and technologically advanced method
                    for creating impactful and immersive experiences. We hope some of the techniques
                    we used to create Tabel will serve as inspiration to the filmmaking community to
                    continue pushing the creative and technical boundaries of storytelling in VR.
                </p>

            </div>
        );
    }
}
