interface HeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
}

export function Header({ title, description, children }: HeaderProps) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h1 className="text-[22px] font-bold tracking-[-0.03em] text-[#1a1523]" style={{ fontFamily: 'Syne, sans-serif' }}>
          {title}
        </h1>
        {description && (
          <p className="text-[13px] text-[#9ca3af] mt-0.5">
            {description}
          </p>
        )}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  )
}
