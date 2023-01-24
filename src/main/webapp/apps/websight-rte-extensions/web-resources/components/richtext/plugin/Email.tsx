import TipTapBold from '@tiptap/extension-bold';

const Email = () => ({
    getTipTapExtensions: () => [TipTapBold],
    getAction: ({ editor }) => ({
        execute: () => editor.chain().focus().toggleBold().run(),
    }),
    getState: ({ editor }) => ({
        isActive: editor.isActive('bold'),
    }),
});

export default Email;
