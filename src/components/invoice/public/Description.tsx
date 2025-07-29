import { EditorContent } from "@/components/invoice/public/EditorContent";
import { isValidJSON } from "@/lib/invoice/content";

type Props = {
  content: string;
};

export function Description({ content }: Props) {
  const value = isValidJSON(content) ? JSON.parse(content) : null;

  // If the content is not valid JSON, return the content as a string
  if (!value) {
    return <div className="font-mono leading-4 text-[11px]">{content}</div>;
  }

  return <EditorContent content={value} />;
}
