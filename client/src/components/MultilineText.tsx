export function MultilineText({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, i, arr) => (
        <span key={i}>
          {line}
          {i < arr.length - 1 && <br />}
        </span>
      ))}
    </>
  )
}
