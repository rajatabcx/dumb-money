import { type Editor } from "@tiptap/react";
import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react/menus";
import { useState } from "react";
import { BubbleMenuItem } from "./BubbleItem";
import { LinkItem } from "./LinkItem";
import { Bold, Italic, Strikethrough } from "lucide-react";

export function BubbleMenu({ editor }: { editor: Editor }) {
  const [openLink, setOpenLink] = useState(false);

  if (!editor) {
    return null;
  }

  return (
    <div>
      <TiptapBubbleMenu editor={editor}>
        <div className="flex w-fit max-w-[90vw] overflow-hidden rounded-full border border-border bg-background text-mono font-regular">
          <>
            <BubbleMenuItem
              editor={editor}
              action={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
            >
              <Bold className="size-4" />
              <span className="sr-only">Bold</span>
            </BubbleMenuItem>

            <BubbleMenuItem
              editor={editor}
              action={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
            >
              <Italic className="size-4" />
              <span className="sr-only">Italic</span>
            </BubbleMenuItem>

            <BubbleMenuItem
              editor={editor}
              action={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive("strike")}
            >
              <Strikethrough className="size-4" />
              <span className="sr-only">Strike</span>
            </BubbleMenuItem>

            <LinkItem editor={editor} open={openLink} setOpen={setOpenLink} />
          </>
        </div>
      </TiptapBubbleMenu>
    </div>
  );
}
