
import { Mark, mergeAttributes } from '@tiptap/core';
//import prose from '../../../../../../../../../node_modules/prosemirror-state';
//import { clickHandler } from './helpers/clickHandler';

export interface EmailOptions {
  openOnClick: boolean,
  HTMLAttributes: Record<string, any>,
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    email: {
      setEmail: (attributes: { href: string, target?: string | null }) => ReturnType,
      toggleEmail: (attributes: { href: string, target?: string | null }) => ReturnType,
      unsetEmail: () => ReturnType,
    }
  }
}

const EmailCore = Mark.create<EmailOptions>({
  name: 'email',

  priority: 1000,

  keepOnSplit: false,

  addOptions() {
    return {
      openOnClick: true,
      HTMLAttributes: {
        target: '_blank',
        rel: 'noopener noreferrer nofollow',
        class: null,
        ['data-part1']: '',
        ['data-part2']: '',
        ['data-part3']: ''
      }
    };
  },

  addAttributes() {
    return {
      href: {
        default: null,
      },
      target: {
        default: this.options.HTMLAttributes.target,
      },
      class: {
        default: this.options.HTMLAttributes.class,
      },
      ['data-part1']: {
        default: null
      },
      ['data-part2']: {
        default: null
      },
      ['data-part3']: {
        default: null
      }
    };
  },

  parseHTML() {
    return [
      { tag: 'a[href]:not([href *= "javascript:" i])' },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const href = HTMLAttributes.href;
    const firstPart = href.split('@')[0];
    const secondPart = href.split('@')[1];
    const data1 = firstPart;
    const data2 = secondPart.split('.')[0];
    const data3 = secondPart.split('.')[1];
    HTMLAttributes.href = '';
    HTMLAttributes.dataset.part1 = data1;
    HTMLAttributes.dataset.part2 = data2;
    HTMLAttributes.dataset.part3 = data3;
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

  // addProseMirrorPlugins(): prose.Plugin[] {
  //   const plugins: prose.Plugin[] = [];

  //   if (this.options.openOnClick) {
  //     plugins.push(clickHandler({
  //       type: this.type,
  //     }));
  //   }

  //   return plugins;
  // },
});
export default EmailCore;
