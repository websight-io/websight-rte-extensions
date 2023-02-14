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
