export default function Button (props) {
  const { className = '', type = 'button', children, ...rest } = props
  return (
    <button
      type={type}
      className={`inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50 ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  )
}
