import Link from '@tiptap/extension-link';
import { mergeAttributes } from '@tiptap/core';
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

const CustomEmail = Link.extend({
  name: 'email',
  addOptions() {
    return {
      openOnClick: false,
      linkOnPaste: false,
      autolink: false,
      protocols: [],
      validate: undefined,
      HTMLAttributes: {
        rel: 'noopener noreferrer nofollow',
        class: null,
        'data-part1': null,
        'data-part2': null,
        'data-part3': null
      }
    };
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
});

export default CustomEmail;
