'use client'
import { FiSun, FiMoon } from "react-icons/fi"
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Image from "next/image"

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  if (!mounted) return (
    <Image
      src="data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNGRkZGRkYiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBoZWlnaHQ9IjIwMHB4IiB3aWR0aD0iMjAwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB4PSIyIiB5PSIyIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiIHJ4PSIyIj48L3JlY3Q+PC9zdmc+Cg=="
      width={36}
      height={36}
      sizes="36x36"
      alt="Loading Light/Dark Toggle"
      priority={false}
      title="Loading Light/Dark Toggle"
    />
  )

  const iconStyle = {
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
  }

  const handleClick = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div
      onClick={handleClick}
      style={iconStyle}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.9)')} // Shrink ao clicar
      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}   // Volta ao tamanho ao soltar
    >
      {resolvedTheme === 'dark' ? <FiSun size={24} /> : <FiMoon size={24} />}
    </div>
  )
}
