export default function FormErrors (props) {
  if (!props.errors || !props.errors.length) {
    return null
  }
  const errors = props.errors.filter(error => (props.param ? error.param === props.param : error.param == null))
  if (!errors.length) {
    return null
  }
  return (
    <ul className='space-y-1 rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive'>
      {errors.map((e, i) => <li key={i}>{e.message}</li>)}
    </ul>
  )
}
