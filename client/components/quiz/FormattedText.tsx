import React from "react"

interface FormattedTextProps {
  text: string
}

export const FormattedText: React.FC<FormattedTextProps> = ({ text }) => {
  // Split on backticks (`)
  const parts = text.split(/(`[^`]+`)/g)

  return (
    <span>
      {parts.map((part, idx) => {
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={idx}
              className="px-1 py-0.5 rounded bg-muted text-muted-foreground font-mono text-sm"
            >
              {part.slice(1, -1)}
            </code>
          )
        } else {
          return <span key={idx}>{part}</span>
        }
      })}
    </span>
  )
}
