import EmailCore from "./extension-email.js";

const Email = () => ({
    getTipTapExtensions: () => [EmailCore.configure({
        openOnClick: false
      })],
      getAction: ({
        editor
      }) => ({
        execute: ({
          href,
          target
        }) => {
          if (href) {
            editor.chain().focus().extendMarkRange('email').setEmail({
              href,
              target
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
