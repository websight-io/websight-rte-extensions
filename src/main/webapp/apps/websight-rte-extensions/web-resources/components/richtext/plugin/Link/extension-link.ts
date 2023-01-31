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
          linkOnPaste: false,
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
