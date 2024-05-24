'use client'
import React from 'react'

const HomeModule = () => {
  return (
    <main style={styles.main}>
      <div>
        <p style={styles.mediumText}>Welcome to</p>
        <h1 style={styles.bigText}>HeyMart A13</h1>
      </div>
    </main>
  )
}

const styles = {
  main: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    textAlign: 'center',
  },
  mediumText: {
    fontSize: '1.25em',
  },
  bigText: {
    fontSize: '2.5em',
    fontWeight: 'bold',
  },
}

export default HomeModule
