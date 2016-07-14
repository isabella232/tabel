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
import { resetBlocks, nextBlock } from "../utils/ui";

export class Cast extends ScrollComponent {

    constructor() {
        super();

        this.cast = {
            "Waiter": {
                id: "waiter",
                role: "Force of Nature",
                description: `
                    The Waiter, a tragic hero, takes pride in the restaurant and probably too
                    much pride in himself. He is superficially charming, but shows increasing
                    difficulty to keep the restaurant running smoothly under pressure. His
                    prideful exterior masks his apparent servitude to both the patrons and
                    the Chef. His pride causes his inaction.`
            },
            "Politician and his wife": {
                id: "politics",
                role: "Government / Politics",
                description: `
                    Out to celebrate their anniversary, this couple is anything but ordinary.
                    He is an up and coming politician with his eye on the mayor’s seat.
                    She is ambitious and tired of being a pawn in his political game.
                    Clearly this pair has different ideas but neither wants to disrupt the
                    status quo. Their denial causes their inaction.`
            },
            "Architect, Engineer, Interior Designer": {
                id: "scientists",
                role: "Science",
                description: `
                    Three frenemies, the restaurant’s architect, engineer and interior designer
                    have come to dine and bask in the glory of their accomplishments. The
                    three of them are so overly focused on esoteric details that they
                    aren’t able to see the larger problems happening right in front of
                    them. Their inability to see the forest for the trees causes their inaction.`
            },
            "CEO and Co-Founder": {
                id: "business",
                role: "Business",
                description: `
                    A startup company co-founder and the CEO of an enterprise are trying to make
                    a deal over dinner. They are under intense negotiations throughout the meal.
                    The co-founder is a visionary and recognizes the long term win-win of their
                    potential partnership but the CEO is risk averse and prefers to settle for a
                    short-term deal. Discounting the future causes their inaction.`
            },
            "DJ": {
                id: "dj",
                role: "Activism",
                description: `
                    It’s not the best gig she’s ever had, but this well educated, social-media
                    addicted DJ is up for the job. She postures in her social posts but fails
                    to truly speak her mind. Finally, fate gives her a chance to make a difference
                    using her actual voice. Self-consciousness causes her inaction.`
            },
            "Food Critic": {
                id: "critic",
                role: "Media",
                description: `
                    A highly trusted tastemaker, the Food Critic, is eager to re-review this
                    restaurant. Like the restaurant itself, he is hiding a serious problem
                    that prevents him from giving an honest review. He struggles to find a balance
                    between revealing his secret or perpetuating his fans’ faithful following.
                    Omission bias causes his inaction.`
            }
        };
    }

    renderContent( props, { stageHeight } ) {
        return (
            <div id="cast" class="section" style={ "min-height: " + stageHeight + "px" }>
                <Title text="characters" />

                <div class="characters">
                    { map( this.cast, ( title ) => {
                        const { role, description, id } = this.cast[ title ];

                        return (
                            <div class={ "character " + nextBlock() }>
                                <div class={ "image " + id }></div>
                                <div class="title-holder">
                                    <h3>{ title }</h3>
                                    <div class="role">{ role.toUpperCase() }</div>
                                </div>
                                <div class="description">{ description }</div>
                            </div>
                        );
                    } ) }

                    { resetBlocks() }
                </div>
            </div>
        );
    }
}
