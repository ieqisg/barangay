import React from 'react'

export default function Input({ className = '', ...props }) {
  return (
    <input
      className={`block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent px-3 py-2 ${className}`}
      {...props}
    />
  )
}
