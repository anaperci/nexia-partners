interface HeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
}

export function Header({ title, description, children }: HeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#111827' }}>
          {title}
        </h1>
        {description && (
          <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
            {description}
          </p>
        )}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  )
}
