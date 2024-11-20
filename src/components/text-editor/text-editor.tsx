'use client';

import { useState } from "react";
import { Button } from "../ui/button";
import LinkDialog from "./link-dialog";
import StarterKit from '@tiptap/starter-kit';
import Strike from "@tiptap/extension-strike";
import TextEditorMenu from './text-editor-menu';
import Underline from '@tiptap/extension-underline';
import Link, { LinkOptions } from "@tiptap/extension-link";
import { ExternalLink, Loader2, Pencil, Trash } from "lucide-react";
import { BubbleMenu, useEditor, EditorContent } from '@tiptap/react';

type Props = {
    content: string,
    className: string;
    onChange: (html: string, text: string) => void;
};

const TextEditor = ({ content, className, onChange }: Props) => {
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const LinkConfig: Partial<LinkOptions> = {
        openOnClick: false
    };
    const editor = useEditor({
        autofocus: true,
        content: content,
        immediatelyRender: false,
        onCreate: () => setLoading(false),
        onUpdate: ({ editor }) =>
            onChange(editor.getHTML(), editor.getText()),
        editorProps: {
            attributes: {
                class: "mt-1 p-2 pt-12 break-all border"
            }
        },
        extensions: [StarterKit, Underline, Strike, Link.configure(LinkConfig)],
    });

    // const toggleLink = () => {
    //     if (!editor) return null;
    //     const previousUrl = editor.getAttributes("link").href;

    //     if (previousUrl) editHyperLinkHref();
    // };

    // const setLink = useCallback(() => {
    //     if (!editor) return null;
    //     const previousUrl = editor.getAttributes("link").href;
    //     editor.chain().focus().extendMarkRange("hyperlink").setHyperlink({ href: previousUrl }).run();
    // }, [editor]);

    // const editHyperLinkText = useCallback(() => {
    //     if (!editor) return null;
    //     const { from } = editor.view.state.selection;
    //     const selectedNode = editor.view.domAtPos(from - 1).node as HTMLElement;

    //     let link: HTMLAnchorElement | null = null;

    //     if (selectedNode?.nodeName === "#text")
    //         link = (selectedNode.parentNode as HTMLElement)?.closest("a");
    //     else
    //         link = selectedNode?.closest("a");

    //     const newText = window.prompt("Edit Hyperlink Text", link?.innerText);

    //     if (newText === null) return;

    //     editor.chain().focus().editHyperLinkText(newText);
    // }, [editor]);

    // const editHyperLinkHref = useCallback(() => {
    //     if (!editor) return null;

    //     const previousUrl = editor.getAttributes("link").href;

    //     const newURL = window.prompt("Edit Hyperlink URL", previousUrl);

    //     if (newURL === null) return;

    //     editor.chain().focus().editHyperLinkHref(newURL);
    // }, [editor]);

    return (
        <div className={className}>
            {!loading ?
                <>
                    {editor &&
                        <>
                            <TextEditorMenu editor={editor} />
                            <BubbleMenu className="bubble-menu-light" tippyOptions={{ duration: 150 }} editor={editor}
                                shouldShow={({ editor, from, to }) => from === to && editor.isActive("link")}>
                                <div className="flex gap-1 border border-gray-400">
                                    <Button className="bg-transparent rounded-none hover:bg-primary-500" size="sm" title="Edit" onClick={() => { }}>
                                        <Pencil className="size-4" />
                                    </Button>
                                    <Button className="bg-transparent rounded-none hover:bg-destructive" title="Delete" size="sm" onClick={() => { }}>
                                        <Trash className="size-4" />
                                    </Button>
                                    <Button className="bg-transparent rounded-none hover:bg-primary-500" title="Open" size="sm" onClick={() => { }}>
                                        <ExternalLink className="size-4" />
                                    </Button>
                                </div>
                            </BubbleMenu></>
                    }
                    <EditorContent editor={editor} />
                    <LinkDialog open={openDialog} />
                </> :
                <div className="flex justify-center items-center min-h-64">
                    <Loader2 className="size-8 animate-spin" absoluteStrokeWidth />
                </div>
            }
        </div >
    );

};

export default TextEditor;