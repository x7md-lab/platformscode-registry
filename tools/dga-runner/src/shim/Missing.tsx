// Fallback for relative imports the zip references but does not contain
// (e.g. a shared <Feedback /> that lives in another template).
export default function Missing() {
  return (
    <div
      style={{
        padding: 16,
        border: "1px dashed #d2d6db",
        color: "#6c727e",
        font: "12px monospace",
        direction: "ltr",
      }}
    >
      [dga-runner] missing relative module stub
    </div>
  )
}
