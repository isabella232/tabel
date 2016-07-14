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
import { makeTitle } from "../utils/ui";
import { UtilComponent } from "../components/base";

export class Title extends UtilComponent {

    componentDidMount() {
        setTimeout( this.removeClass , 400, "title-hidden" );
        setTimeout( this.removeClass, 3000, "fade-in-title" );
    }

    componentWillUnmount() {
        this.base.classList.add( "title-hidden", "fade-in-title" );
    }

    render() {
        return <h2 class="fade-in-title title-hidden">{ makeTitle( this.props.text ) }</h2>;
    }
}