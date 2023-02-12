import { getAttributes } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

export function clickHandler(options: { type: any; }) {
  return new Plugin({
    key: new PluginKey('handleClickEmail'),
    props: {
      handleClick: (view, pos, event) => {
        console.log('handleClick:', view, event.target);
        const attrs = getAttributes(view.state, options.type.name);
        console.log(attrs);
        // const link = (event.target as HTMLElement)?.closest('a');

        // if (link && attrs.href) {
        //   window.open(attrs.href, attrs.target);

        //   return true;
        // }

        return false;
      },
    },
  });
}
