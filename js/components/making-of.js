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
import { nextBlock, lastBlock } from "../utils/ui";
import { StaticImage, StaticVideo } from "./static-image";

export class MakingOf extends ScrollComponent {

    constructor() {
        super();

        this.bindings.isIPhone = "isIPhone";
    }

    renderContent( props, { stageHeight, scrollY, isIPhone } ) {
        return (
            <div id="making-of" class="section" style={ "min-height: " + stageHeight + "px" }>
                <Title text="Making Of"/>

                <p class={ nextBlock() }>
                    What is something we all wish we could do in real life, but is slightly
                    unreachable? VR is all about&nbsp;
                    <a href="https://www.thinkwithgoogle.com/articles/vr-content-audience-engagement-best-practices.html"
                       target="_blank">opening a closed door</a> for the user. Imagine if you could
                    hear every conversation taking place in a restaurant. We wondered what stories
                    we would hear, and how we make these stories come to life in virtual reality.
                </p>

                <h3 class={ nextBlock() }>Opening a Closed Door</h3>

                <p class={ nextBlock() }>
                    The creative canvas for storytelling has hit another evolutionary milestone with
                    the introduction of virtual reality. Immersive 360 degree experiences have
                    opened an opportunity to redefine how stories are told.
                </p>

                <p class={ nextBlock() }>
                    For Tabel, we wanted to experiment with storytelling that takes advantage of two
                    strengths of the medium:
                </p>

                <ol class={ nextBlock() }>
                    <li>
                        VR is uniquely capable of enhancing human capabilities while maintaining the
                        semblance of true-to-life situations.
                    </li>
                    <li>
                        VR empowers the storyteller to tell a story over the entire 360 degrees of a
                        scene. This is a large canvas! 360 film does not have to restrict the viewer
                        to focus only on a directed object, but rather the VR directors can create a
                        world the viewer experiences on his own terms.
                    </li>
                </ol>

                <p class={ nextBlock() }>
                    Tabel started with seed of an idea about eavesdropping on conversations in a
                    restaurant. To create a realistic atmosphere, we needed multiple tables, various
                    storylines, and it had to all be happening concurrently, like it would in a real
                    restaurant. VR itself is a new experience for most users, and the story of Tabel
                    itself is a new world for that user. The film is about the interaction and
                    control the user has with the audio experience of the film. So, we created a
                    familiar, comfortable restaurant setting to ease our viewer into world of Tabel.
                </p><br/>

                <p class={ nextBlock() }>
                    To push the limits of reality, we thought about ways that each of the
                    simultaneous storylines could ladder up to a meta story about something more
                    than just the restaurant.
                </p>

                <StaticImage src="/static/images/making-of-text.jpg"
                             classes={ nextBlock() }
                             scrollY={ scrollY } />

                <p class={ nextBlock() }>
                    The viewer sits at the center of the restaurant and by looking around the
                    restaurant, he actively observes the other storylines unfolding. The viewer is
                    at the center of story throughout the film but he may not realize this until the
                    end. At the conclusion of Tabel, the viewer’s worldview turns introspective. Not
                    only have the other patrons of the restaurant taken no action to save the
                    restaurant from catching fire, but the viewer himself has taken no action to
                    halt the pending disaster unfolding around everyone.
                </p><br/>

                <p class={ nextBlock() }>
                    Ultimately, the result was several overlapping short films that the viewer will
                    experience at the same time. In this 360 live action film, the user has the
                    agency to follow any storyline, in any order they want. The viewer becomes the
                    director, and the traditional role of the director becomes something else
                    entirely. The director of the VR experience necessarily needs to understand the
                    capabilities and limitations of the technology in order to design an environment
                    the user can easily navigate and quickly learn to direct for themselves.
                </p>

                <h3 class={ nextBlock() }>
                    Designing interactive audio for a 360 live action film
                </h3>

                <p class={ nextBlock() }>
                    360 videos are the stepping stone into VR, but they are often seen as a passive
                    experience. In a 360 video, the viewer can’t move around voluntarily, but they
                    can look around. We wanted to give them a reason to want to explore. Knowing
                    that sound carries a lot of importance in the 360 environment, we leveraged it
                    as a tool to help enhance the experience. We developed a directional audio
                    technique that opened a new avenue for storytelling.
                </p><br/>

                <p class={ nextBlock() }>
                    We started with a simple prototype to see what could be done technically. For
                    this, using a 360 camera, we filmed a quick take of three people standing in a
                    kitchen talking to themselves. After creating a custom video player, the user
                    was able to look around and hear the different voices by looking in the
                    direction of the person speaking. We had a technical solution that allowed
                    viewers to “hear what they see”! This prototype gave us a chance to see what
                    could be done technically in a realistic setting.
                </p><br/>

                <p class={ nextBlock() }>
                    Keeping the camera stationary meant that the user doesn’t need too much time to
                    orient themselves to the environment, they have complete control of where they
                    place their attention. By experimenting with the directional audio technique, we
                    were able to add a layer of interactivity.  This prototype gave us a clear
                    direction to create a 360 video with an interactive component that viewers could
                    easily understand.
                </p>

                <h3 class={ nextBlock() }>VR is for everyone</h3>

                <p class={ nextBlock() }>
                    We believe VR is for everyone. We wanted to create an experience that could be
                    viewed with a headset but did not require specialized VR hardware to view. We
                    wanted to remove as many barriers as possible. With this in mind, we built using
                    a browser-based WebVR experience which means the film can viewed through
                    desktop, mobile, or enhanced with a headset (Cardboard, Daydream, or Vive).
                </p>

                <h3 class={ nextBlock() }>The rules have yet to be defined</h3>

                <p class={ lastBlock() }>
                    Nothing is off limits. Everyone is testing, experimenting and pushing the
                    boundaries of what’s possible. We created Tabel to explore storytelling
                    possibilities within VR to bridge tech and creative in a new and impactful way.
                    The behind the scenes footage is almost more important to the work than the film
                    itself. There are still many opportunities to explore and define the rules
                    together. What will you create?
                </p>

                { isIPhone ?
                    <StaticImage src="/static/images/making-of-panorama.jpg"
                                 classes={ nextBlock() }
                                 scrollY={ scrollY } /> :
                    <StaticVideo src="/static/images/making-of-panorama.mp4"
                                 classes={ nextBlock() }
                                 scrollY={ scrollY } /> }
            </div>
        );
    }
}
