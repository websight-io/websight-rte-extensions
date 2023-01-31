import CustomLink from './extension-link.js';

const Link = () => ({
  getTipTapExtensions: () => [CustomLink.configure({
    openOnClick: false,
    linkOnPaste: false
  })],
  getAction: ({
    editor
  }) => ({
    execute: ({
      href,
      target
    }) => {
      if (href) {
        editor.chain().focus().extendMarkRange('link').setLink({
          href,
          target
        }).run();
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
