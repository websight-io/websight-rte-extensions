import {  markPasteRule, mergeAttributes, Mark } from '@tiptap/core';
import { autolink } from './helpers/autolink.js';
import { pasteHandler } from './helpers/pasteHandler.js';
import { find, reset } from 'linkifyjs';
import { Plugin } from '@tiptap/pm/state';
import { splitEmail } from './helpers/splitEmail.js';
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    email: {
      setEmail: (attributes: 
        { 'data-part1': string | null, 'data-part2': string | null, 'data-part3': string | null }
        ) => ReturnType,
      toggleEmail: (attributes: 
        { 'data-part1': string | null, 'data-part2': string | null, 'data-part3': string | null }
        ) => ReturnType,
      unsetEmail: () => ReturnType,
    }
  }
}

const CustomEmail = Mark.create({
  name: 'email',
  priority: 1000,
  addOptions() {
    return {
      linkOnPaste: false,
      autolink: false,
      HTMLAttributes: {
        rel: 'noopener noreferrer nofollow',
        class: null,
        'data-part1': null,
        'data-part2': null,
        'data-part3': null
      }
    };
  },
  onDestroy() {
    reset();
  },
  inclusive() {
    return this.options.autolink;
  },
  addAttributes() {
    return {
      class: {
        default: this.options.HTMLAttributes.class,
      },
      'data-part1': {
        default: null
      },
      'data-part2': {
        default: null
      },
      'data-part3': {
        default: null
      }
    };
  },

  parseHTML() {
    return [
      { tag: 'a[data-part1][data-part2][data-part3]' },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'a',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
  addCommands() {
    return {
      setEmail: attributes => ({ chain }) => {
        return chain()
          .setMark(this.name, attributes)
          .setMeta('preventAutolink', true)
          .run();
      },

      toggleEmail: attributes => ({ chain }) => {
        return chain()
          .toggleMark(this.name, attributes, { extendEmptyMarkRange: true })
          .setMeta('preventAutolink', true)
          .run();
      },

      unsetEmail: () => ({ chain }) => {
        return chain()
          .unsetMark(this.name, { extendEmptyMarkRange: true })
          .setMeta('preventAutolink', true)
          .run();
      },
    };
  },
  addPasteRules() {
    return [
      markPasteRule({
        find: text => find(text, 'email')
          .filter(email => {
            if (this.options.validate) {
              return this.options.validate(email.value);
            }

            return true;
          })
          .filter(email => email.isLink)
          .map(email => ({
            text: email.value,
            index: email.start,
            data: email,
          })),
        type: this.type,
        getAttributes: match => (splitEmail(match.data?.href)),
      }),
    ]
  },

  addProseMirrorPlugins() {
    const plugins: Plugin[] = [];

    if (this.options.autolink) {
      plugins.push(
        autolink({
          type: this.type,
          validate: this.options.validate,
        }),
      );
    }

    if (this.options.linkOnPaste) {
      plugins.push(
        pasteHandler({
          editor: this.editor,
          type: this.type,
        }),
      );
    }

    return plugins;
  },
});

export default CustomEmail;
