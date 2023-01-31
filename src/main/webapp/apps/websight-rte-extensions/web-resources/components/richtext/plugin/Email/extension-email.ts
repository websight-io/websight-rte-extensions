import Link from '@tiptap/extension-link';
import { mergeAttributes, PasteRule, markPasteRule } from '@tiptap/core';
import { splitEmail } from './helpers/splitEmail.js';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    email: {
      setEmail: (attributes: 
        { href: string, target?: string | null, 'data-part1': string | null, 'data-part2': string | null, 
        'data-part3': string | null }
        ) => ReturnType,
      toggleEmail: (attributes: 
        { href: string, target?: string | null, 'data-part1': string | null, 'data-part2': string | null, 
        'data-part3': string | null }
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
        target: '_blank',
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
      href: {
        default: null,
      },
      target: {
        default: this.options.HTMLAttributes.target,
      },
      class: {
        default: this.options.HTMLAttributes.class,
      },
      'data-part1': {
        default: this.options.HTMLAttributes['data-part1']
      },
      'data-part2': {
        default: this.options.HTMLAttributes['data-part2']
      },
      'data-part3': {
        default: this.options.HTMLAttributes['data-part3']
      }
    };
  },

  parseHTML() {
    return [
      { tag: 'a[data-part1][data-part2][data-part3]' },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    if (!HTMLAttributes.href && this.name === 'email') {
      HTMLAttributes.href = 
      `${HTMLAttributes['data-part1']}@${HTMLAttributes['data-part2']}.${HTMLAttributes['data-part3']}`;
      return [
        'a',
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
        0,
      ];
    } else {
      const href = HTMLAttributes.href;
      HTMLAttributes.href = null;
      return [
        'a',
        mergeAttributes(this.options.HTMLAttributes, 
          {
            ...HTMLAttributes,
            ...splitEmail(href)
          }),
        0,
      ];
    }
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

// import { Mark, mergeAttributes } from '@tiptap/core';

// export interface EmailOptions {
//   HTMLAttributes: Record<string, any>,
// }

// declare module '@tiptap/core' {
//   interface Commands<ReturnType> {
//     email: {
//       setEmail: (attributes: 
//         { href: string, target?: string | null, 'data-part1': string | null, 'data-part2': string | null, 
//         'data-part3': string | null }
//         ) => ReturnType,
//       toggleEmail: (attributes: 
//         { href: string, target?: string | null, 'data-part1': string | null, 'data-part2': string | null, 
//         'data-part3': string | null }
//         ) => ReturnType,
//       unsetEmail: () => ReturnType,
//     }
//   }
// }

// const CustomEmail = Mark.create<EmailOptions>({
//   name: 'email',
//   priority: 1000,
//   keepOnSplit: false,


//   addOptions() {
//     return {
//       HTMLAttributes: {
//         target: '_blank',
//         rel: 'noopener noreferrer nofollow',
//         class: null,
//         'data-part1': null,
//         'data-part2': null,
//         'data-part3': null
//       }
//     };
//   },

//   addAttributes() {
//     return {
//       href: {
//         default: null,
//       },
//       target: {
//         default: this.options.HTMLAttributes.target,
//       },
//       class: {
//         default: this.options.HTMLAttributes.class,
//       },
//       'data-part1': {
//         default: this.options.HTMLAttributes['data-part1']
//       },
//       'data-part2': {
//         default: this.options.HTMLAttributes['data-part2']
//       },
//       'data-part3': {
//         default: this.options.HTMLAttributes['data-part3']
//       }
//     };
//   },

//   parseHTML() {
//     return [
//       { tag: 'a[data-part1][data-part2][data-part3]' },
//     ];
//   },

//   renderHTML({ HTMLAttributes }) {
//     if (!HTMLAttributes.href && this.name === 'email') {
//       HTMLAttributes.href = 
//       `${HTMLAttributes['data-part1']}@${HTMLAttributes['data-part2']}.${HTMLAttributes['data-part3']}`;
//       return [
//         'a',
//         mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
//         0,
//       ];
//     } else {
//       const href = HTMLAttributes.href;
//       const firstPart = href.split('@')[0];
//       const secondPart = href.split('@')[1];
//       const data1 = firstPart;
//       const data2 = secondPart.split('.')[0];
//       const data3 = secondPart.split('.')[1];
//       HTMLAttributes.href = null;
//       return [
//         'a',
//         mergeAttributes(this.options.HTMLAttributes, 
//           {
//             ...HTMLAttributes,
//             'data-part1': data1, 
//             'data-part2': data2, 
//             'data-part3': data3
//           }),
//         0,
//       ];
//     }
//   },

//   addCommands() {
//     return {
//       setEmail: attributes => ({ chain }) => {
//         return chain()
//           .setMark(this.name, attributes)
//           .setMeta('preventAutolink', true)
//           .run();
//       },

//       toggleEmail: attributes => ({ chain }) => {
//         return chain()
//           .toggleMark(this.name, attributes, { extendEmptyMarkRange: true })
//           .setMeta('preventAutolink', true)
//           .run();
//       },

//       unsetEmail: () => ({ chain }) => {
//         return chain()
//           .unsetMark(this.name, { extendEmptyMarkRange: true })
//           .setMeta('preventAutolink', true)
//           .run();
//       },
//     };
//   },
// });
// export default CustomEmail;
