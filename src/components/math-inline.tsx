import katex from 'katex'

export function MathInline({ expr }: { expr: string }) {
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(expr, { throwOnError: false }),
      }}
    />
  )
}
