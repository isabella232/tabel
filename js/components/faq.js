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

export class Faq extends ScrollComponent {

    renderContent( props, { stageHeight } ) {
        return (
            <div id="faq" class="section" style={ "min-height: " + stageHeight + "px" }>
                <Title text="FAQ" />

                <h3 class={ nextBlock() }>Why did Google make this VR film?</h3>

                <p class={ nextBlock() }>
                    We created Tabel to experiment with creating a VR film that balances between
                    a passive and an interactive viewing experience. It is our hope that some
                    of the technology and creative techniques used in Tabel will serve as
                    inspiration for other VR creators within the creative and filmmaking industries.
                </p>

                <h3 class={ nextBlock() }>
                    Is this film representative of Google’s opinions on climate change?
                </h3>

                <p class={ nextBlock() }>
                    The opinions and actions expressed in this film are not intended to represent
                    Google’s stance on climate change or any other subject expressed in the film.
                </p>

                <h3 class={ nextBlock() }>What is Art, Copy & Code?</h3>

                <p class={ nextBlock() }>
                    Art, Copy & Code is a Google initiative that explores ways to fuse creative
                    ideas with new technologies to showcase unique and impactful storytelling
                    possibilities in digital mediums.
                </p>

                <h3 class={ nextBlock() }>What is the best way to view Tabel?</h3>

                <p class={ nextBlock() }>
                    Tabel can be viewed without a VR device directly from your browser on desktop or
                    on mobile. However, we highly recommend viewing the film with a Cardboard VR
                    viewing device and with headphones.
                </p>

                <h3 class={ nextBlock() }>What is Google Cardboard?</h3>

                <p class={ nextBlock() }>
                    Google Cardboard is a virtual reality viewer made almost entirely of actual
                    cardboard which enables you to experience virtual reality from your smartphone.
                </p>

                <h3 class={ nextBlock() }>Where can I buy a Cardboard viewer?</h3>

                <p class={ nextBlock() }>
                    <a href="https://vr.google.com/cardboard/" target="_blank">
                        https://vr.google.com/cardboard/
                    </a> is a list of Google certified Cardboard viewers.
                </p>

                <h3 class={ nextBlock() }>What is Directional Audio?</h3>

                <p class={ nextBlock() }>
                    The audio technique we used to allow Tabel viewers to interact with the film
                    environment. This directional 360 audio in VR that will enable the viewer to
                    hear different audio experiences based on their point-of-view.
                </p>

                <h3 class={ nextBlock() }>How did we film Tabel?</h3>

                <p class={ nextBlock() }>
                    We used the GoPro Odyssey Camera with Jump Technology. You can learn more about
                    Jump here: <a href="https://vr.google.com/jump/" target="_blank">
                    https://vr.google.com/jump</a>
                </p>

                <h3 class={ nextBlock() }>How can I create a VR film with directional audio?</h3>

                <p class={ "policy " + lastBlock() }>
                    <a href="https://www.google.com/policies/privacy/" target="_blank">
                        PRIVACY POLICY
                    </a>
                </p>

            </div>
        );
    }
}
