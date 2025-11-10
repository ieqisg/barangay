import React from 'react'

export function DropdownMenu({ children, className = '', ...props }) {
  return (
    <div className={`relative inline-block text-left ${className}`} {...props}>
      {children}
    </div>
  )
}

export function DropdownMenuTrigger({ children, asChild = false }) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children)
  }
  return (
    <button type="button" className="inline-flex items-center" aria-haspopup="true" aria-expanded="false">
      {children}
    </button>
  )
}

export function DropdownMenuContent({ children, className = '', align = 'start', forceMount = false, ...props }) {
  // align: 'start' | 'end'
  const alignClass = align === 'end' ? 'right-0' : 'left-0'
  return (
    <div
      className={`absolute z-50 mt-2 ${alignClass} bg-white border rounded-md shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function DropdownMenuItem({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
