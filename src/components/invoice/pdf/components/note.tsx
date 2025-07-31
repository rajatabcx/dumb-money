import { Text, View } from "@react-pdf/renderer";
import { EditorContent } from "./editor-content";
import { EditorDoc } from "@/lib/invoice/types";

type Props = {
  content?: EditorDoc | null;
  noteLabel?: string;
};

export function Note({ content, noteLabel }: Props) {
  if (!content) return null;
  return (
    <View style={{ marginTop: 20 }}>
      <Text style={{ fontSize: 9, fontWeight: 500 }}>{noteLabel}</Text>
      <EditorContent content={content} />
    </View>
  );
}
