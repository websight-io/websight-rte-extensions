/*
 * Copyright (C) 2022 Dynamic Solutions
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

type Parts = {
    'data-part1': string
    'data-part2': string
    'data-part3': string
}

export function splitEmail(href: string): Parts {
    const [firstPart, secondPart] = href.split('@');
    const data1 = firstPart.includes('mailto:') ? firstPart.split('mailto:')[1] : firstPart;
    const [data2, data3] = secondPart.split('.');
    
    return { 
        'data-part1': data1, 
        'data-part2': data2, 
        'data-part3': data3
    };
}
