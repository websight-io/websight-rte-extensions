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

import { Editor } from '@tiptap/core';
import { MarkType } from 'prosemirror-model';
import { Plugin, PluginKey } from 'prosemirror-state';
import { find } from 'linkifyjs';
import { splitEmail } from './splitEmail.js';

type PasteHandlerOptions = {
  editor: Editor
  type: MarkType
}

export function pasteHandler(options: PasteHandlerOptions): Plugin {
  return new Plugin({
    key: new PluginKey('handlePasteEmail'),
    props: {
      handlePaste: (view, event, slice) => {
        const { state } = view;
        const { selection } = state;
        const { empty } = selection;

        if (empty) {
          return false;
        }

        let textContent = '';

        slice.content.forEach(node => {
          textContent += node.textContent;
        });

        const email = find(textContent, 'email').find(item => 
            item.isLink && 
            item.value === textContent);

        if (!textContent || !email) {
          return false;
        }

        options.editor.commands.setMark(options.type, splitEmail(email.href));

        return true;
      },
    },
  });
}
