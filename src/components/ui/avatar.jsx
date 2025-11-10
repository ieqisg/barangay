import React from 'react'

export default function Avatar({ children, className = '', ...props }) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function AvatarFallback({ children, className = '', ...props }) {
  return (
    <div className={`flex items-center justify-center w-full h-full ${className}`} {...props}>
      {children}
    </div>
  )
}
