import React from 'react'

interface DropdownProps {
  value: string
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  options: { value: string; label: string }[]
}

const Dropdown: React.FC<DropdownProps> = ({ value, onChange, options }) => {
  return (
    <select value={value} onChange={onChange} style={styles.select}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  select: {
    padding: '10px',
    fontSize: '1em',
    marginBottom: '20px',
  },
}

export default Dropdown
