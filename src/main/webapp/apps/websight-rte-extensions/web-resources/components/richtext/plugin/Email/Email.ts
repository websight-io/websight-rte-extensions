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

import CustomEmail from "./extension-email.js";
import { splitEmail } from "./helpers/splitEmail.js";
import { validateEmail } from "./helpers/validateEmail.js";

const Email = () => ({
    getTipTapExtensions: () => [CustomEmail.configure({autolink: true, linkOnPaste: true})],
    getAction: ({
      editor
    }) => ({
      execute: ({hrefDecoded}) => {
        if (validateEmail(hrefDecoded)) {
          editor.chain().focus().extendMarkRange('email').setEmail({
            hrefDecoded,
            ...splitEmail(hrefDecoded)
          }).run();
        } else {
          editor.chain().focus().extendMarkRange('email').unsetEmail().run();
        }
      }
    }),
    getState: ({
      editor
    }) => ({
      isActive: editor.isActive('email'),
      ...editor.getAttributes('email')
    })
});

export default Email;
