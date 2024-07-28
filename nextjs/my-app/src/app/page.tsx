"use client"
import React from 'react'
import MainRoute from './components/main-route'

export default function Index() {

  return (
    <div>
      {window ? <MainRoute /> : null}
    </div>
  )
}
