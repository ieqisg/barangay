import React from 'react'

export default function TextArea({ className = '', ...props }) {
  return (
    <textarea
      className={`block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent px-3 py-2 min-h-[100px] resize-y ${className}`}
      {...props}
    />
  )
}