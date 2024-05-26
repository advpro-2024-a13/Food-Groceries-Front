import React from 'react'
import { CSSProperties } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        {children}
        <button style={modalStyles.closeButton} onClick={onClose}>
          X
        </button>
      </div>
    </div>
  )
}

interface ModalSectionProps {
  children: React.ReactNode
}

export const ModalHeader: React.FC<ModalSectionProps> = ({ children }) => (
  <div style={modalStyles.header}>{children}</div>
)

export const ModalBody: React.FC<ModalSectionProps> = ({ children }) => (
  <div style={modalStyles.body}>{children}</div>
)

export const ModalFooter: React.FC<ModalSectionProps> = ({ children }) => (
  <div style={modalStyles.footer}>{children}</div>
)

const modalStyles: { [key: string]: CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px',
    width: '80%',
    maxWidth: '500px',
    position: 'relative',
  },
  header: {
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: '10px',
    marginBottom: '10px',
  },
  body: {
    paddingBottom: '10px',
  },
  footer: {
    borderTop: '1px solid #e0e0e0',
    paddingTop: '10px',
    marginTop: '10px',
    textAlign: 'right',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '1.5em',
    cursor: 'pointer',
  },
}
