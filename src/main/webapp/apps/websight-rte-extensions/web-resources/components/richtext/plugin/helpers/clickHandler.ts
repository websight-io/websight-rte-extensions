import { getAttributes } from '@tiptap/core';
import prose from 'prosemirror-state';

export function clickHandler(options: { type: any; }) {
  return new prose.Plugin({
    key: new prose.PluginKey('handleClickEmail'),
    props: {
      handleClick: (view, pos, event) => {
        const attrs = getAttributes(view.state, options.type.name);
        const link = (event.target as HTMLElement)?.closest('a');

        if (link && attrs.href) {
          window.open(attrs.href, attrs.target);

          return true;
        }

        return false;
      },
    },
  });
}
