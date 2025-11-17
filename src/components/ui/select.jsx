import React, { useState } from 'react'

// Lightweight composite Select implementation that adapts the pattern used in Register.jsx.
// Usage (keeps same JSX shape):
// <Select>
//   <SelectTrigger>
//     <SelectValue placeholder="..." />
//   </SelectTrigger>
//   <SelectContent>
//     <SelectItem value="a">A</SelectItem>
//   </SelectContent>
// </Select>

export function Select({ children, className = '', value: propValue, onValueChange, ...props }) {
  const parts = React.Children.toArray(children)
  const trigger = parts.find((c) => c && c.type && c.type.displayName === 'SelectTrigger')
  const content = parts.find((c) => c && c.type && c.type.displayName === 'SelectContent')

  const placeholder = trigger
    ? React.Children.toArray(trigger.props.children).find((c) => c && c.type && c.type.displayName === 'SelectValue')?.props?.placeholder
    : undefined

  const items = content ? React.Children.toArray(content.props.children) : []
  const [value, setValue] = useState(propValue ?? '')

  // keep internal state in sync when controlled from parent
  React.useEffect(() => {
    if (propValue !== undefined && propValue !== value) setValue(propValue ?? '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propValue])

  const handleChange = (e) => {
    const v = e.target.value
    setValue(v)
    if (typeof onValueChange === 'function') onValueChange(v)
  }

  return (
    <div className={`relative ${className}`} {...props}>
      <select
        value={value}
        onChange={handleChange}
        className="block w-full rounded-md border-gray-300 px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500"
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {items.map((item, idx) => (
          <option key={idx} value={item.props.value}>
            {item.props.children}
          </option>
        ))}
      </select>
    </div>
  )
}

export function SelectTrigger({ children }) {
  return <>{children}</>
}
SelectTrigger.displayName = 'SelectTrigger'

export function SelectValue({ placeholder }) {
  // Rendered only for metadata; Select reads it from the trigger
  return null
}
SelectValue.displayName = 'SelectValue'

export function SelectContent({ children }) {
  return <>{children}</>
}
SelectContent.displayName = 'SelectContent'

export function SelectItem({ children }) {
  // Rendered only as data for Select
  return <>{children}</>
}
SelectItem.displayName = 'SelectItem'
