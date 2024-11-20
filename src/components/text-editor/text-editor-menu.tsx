import { Button } from '../ui/button';
import { Editor } from '@tiptap/react';
import React, { useCallback, useState } from 'react';
import { Bold, Italic, Link, Strikethrough, Underline as UnderlineIcon } from 'lucide-react';

type Props = {
    editor: Editor;
};

const TextEditorMenu = ({ editor }: Props) => {
    const [modalIsOpen, setIsOpen] = useState(false);
    const [url, setUrl] = useState<string>("");

    const openModal = useCallback(() => {
        setUrl(editor.getAttributes("link").href);
        setIsOpen(true);
    }, [editor]);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setUrl("");
    }, []);

    const saveLink = useCallback(() => {
        // if (url)
        //     editor.chain().focus().extendMarkRange("link").setHyperlink({ href: url, target: "_blank" }).run();
        // else
        //     editor.chain().focus().extendMarkRange("link").unsetHyperlink().run();

        closeModal();
    }, [editor, url, closeModal]);

    const removeLink = useCallback(() => {
        // editor.chain().focus().extendMarkRange("link").setHyperlink().run();
        closeModal();
    }, [editor, closeModal]);

    const setLink = () => { };

    return (
        <div className="flex gap-1 p-2 border-b-2 border-gray-500 absolute w-full z-10 top-1">
            <Button className={`${editor.isActive("bold") ? "bg-primary-500 hover:bg-primary-500" : "bg-dark-3 hover:bg-dark-4"}`}
                onClick={() => editor.chain().focus().toggleBold().run()} size="sm" title='Bold' type='button'>
                <Bold />
            </Button>
            <Button className={`${editor.isActive("italic") ? "bg-primary-500 hover:bg-primary-500" : "bg-dark-3 hover:bg-dark-4"}`}
                onClick={() => editor.chain().focus().toggleItalic().run()} size="sm" title='Italic' type='button'>
                <Italic />
            </Button>
            <Button className={`${editor.isActive("underline") ? "bg-primary-500 hover:bg-primary-500" : "bg-dark-3 hover:bg-dark-4"}`}
                onClick={() => editor.chain().focus().toggleUnderline().run()} size="sm" title='Underline' type='button'>
                <UnderlineIcon />
            </Button>
            <Button className={`${editor.isActive("strike") ? "bg-primary-500 hover:bg-primary-500" : "bg-dark-3 hover:bg-dark-4"}`}
                onClick={() => editor.chain().focus().toggleStrike().run()} size="sm" title='Underline' type='button'>
                <Strikethrough />
            </Button>
            <Button className={`${editor.isActive("link") ? "bg-primary-500 hover:bg-primary-500" : "bg-dark-3 hover:bg-dark-4"}`}
                onClick={setLink} size="sm" title='Link' type='button'>
                <Link />
            </Button>
        </div>
    );
};

export default TextEditorMenu;