import { View } from "@react-pdf/renderer";
import { formatEditorContent } from "../format";
import { EditorDoc } from "@/lib/invoice/types";

type Props = {
  content?: EditorDoc | null;
};

export function EditorContent({ content }: Props) {
  if (!content) {
    return null;
  }

  return (
    <View style={{ marginTop: 10, lineHeight: 0.9 }}>
      {formatEditorContent(content)}
    </View>
  );
}
