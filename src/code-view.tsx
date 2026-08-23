import CodeMirror from "@uiw/react-codemirror"
import { javascript } from "@codemirror/lang-javascript"
import { EditorView } from "@codemirror/view"
import { usePreviewPrefs } from "./preview-prefs"

/**
 * Lets the editor grow with its content and repaints its chrome with the
 * site tokens, so the block follows light/dark with the rest of the page.
 */
const surface = EditorView.theme({
  "&": {
    height: "auto",
    backgroundColor: "var(--card)",
    color: "var(--foreground)",
  },
  ".cm-scroller": { overflowY: "visible" },
  ".cm-gutters": {
    backgroundColor: "var(--card)",
    color: "var(--muted-foreground)",
    borderRight: "1px solid var(--border)",
  },
  ".cm-activeLineGutter": { backgroundColor: "transparent" },
})

const codeExtensions = [javascript({ jsx: true, typescript: true }), surface]

export default function CodeView({ code }: { code: string }) {
  const { mode } = usePreviewPrefs()
  return (
    <CodeMirror
      value={code.trimEnd()}
      extensions={codeExtensions}
      theme={mode}
      editable={false}
      basicSetup={{
        lineNumbers: true,
        foldGutter: false,
        highlightActiveLine: false,
        highlightActiveLineGutter: false,
      }}
      style={{ fontSize: 13 }}
      // the bundled dark theme paints its own #282c34; repaint the chrome
      // with our surface so the block sits flush inside the section card
      className="[&_.cm-editor]:bg-card! [&_.cm-gutters]:border-border! [&_.cm-gutters]:bg-card! [&_.cm-gutters]:text-muted-foreground!"
    />
  )
}
