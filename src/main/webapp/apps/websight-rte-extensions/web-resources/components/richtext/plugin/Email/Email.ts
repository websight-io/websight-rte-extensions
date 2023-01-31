import CustomEmail from "./extension-email.js";
import { splitEmail } from "./helpers/splitEmail.js";
import { validateEmail } from "./helpers/validateEmail.js";

const Email = () => ({
    getTipTapExtensions: () => [CustomEmail],
      getAction: ({
        editor
      }) => ({
        execute: ({href, target}) => {
          if (validateEmail(href)) {
            editor.chain().focus().extendMarkRange('email').setEmail({
              href,
              target,
              ...splitEmail(href)
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
