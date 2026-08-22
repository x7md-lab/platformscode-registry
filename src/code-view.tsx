import CodeMirror from "@uiw/react-codemirror"
import { javascript } from "@codemirror/lang-javascript"
import { EditorView } from "@codemirror/view"

const fullHeight = EditorView.theme({
  "&": { height: "auto" },
  ".cm-scroller": { overflowY: "visible" },
})

const codeExtensions = [javascript({ jsx: true, typescript: true }), fullHeight]

export default function CodeView({ code }: { code: string }) {
  return (
    <CodeMirror
      value={code.trimEnd()}
      extensions={codeExtensions}
      editable={false}
      basicSetup={{
        lineNumbers: true,
        foldGutter: false,
        highlightActiveLine: false,
        highlightActiveLineGutter: false,
      }}
      style={{ fontSize: 13 }}
    />
  )
}
