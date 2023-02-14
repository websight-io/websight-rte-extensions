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
