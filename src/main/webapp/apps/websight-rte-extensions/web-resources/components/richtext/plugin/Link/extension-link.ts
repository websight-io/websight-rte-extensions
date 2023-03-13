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

import Link from '@tiptap/extension-link';

const CustomLink = Link.extend({
    parseHTML() {
        return [
            { tag: 'a[href]:not([href *= "javascript:" i]):not([data-part1]):not([data-part2]):not([data-part3])' },
        ];
    },
    addOptions() {
        return {
          openOnClick: false,
          linkOnPaste: true,
          autolink: false,
          protocols: [],
          HTMLAttributes: {
            target: '_blank',
            rel: 'noopener noreferrer nofollow',
            class: null,
          },
          validate: undefined,
        };
      },
});

export default CustomLink;
