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

import { validateEmail } from '../Email/helpers/validateEmail.js';
import CustomLink from './extension-link.js';

function isInternal(link: string) {
  if (link.startsWith('/') || link.startsWith('#')) {
    return true;
  }
  const linkHost = new URL(link).hostname;
  const pageHost = window.location.hostname;
  return linkHost === pageHost;
}

const Link = () => ({
  getTipTapExtensions: () => [CustomLink.configure({validate(url) {
      return !validateEmail(url);
  },})],
  getAction: ({
    editor
  }) => ({
    execute: ({
      href,
      target
    }) => {
      if (href) {
        if (isInternal(href)) {
          editor.chain().focus().extendMarkRange('link').setLink({
            href,
            target
          }).updateAttributes('link', {
            rel: 'follow',
          }).run();
        } else {
          editor.chain().focus().extendMarkRange('link').setLink({
            href,
            target
          }).run();
        }
      } else {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
      }
    }
  }),
  getState: ({
    editor
  }) => ({
    isActive: editor.isActive('link'),
    ...editor.getAttributes('link')
  })
});

export default Link;
