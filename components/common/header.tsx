'use client'

import { FileText } from 'lucide-react'
import NavLink from './nav-link'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs'
import React from 'react'

export default function Header() {
  return (
    <nav className="container mx-auto flex items-center justify-between px-8 py-4">
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <NavLink href="/" className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-rose-500" />
          <span className="text-xl font-bold text-rose-600">Sommaire</span>
          <span className="text-gray-500">AI</span>
        </NavLink>
      </div>

      {/* Center nav - only shown if signed in */}
      <SignedIn>
        <div className="hidden lg:flex gap-8 text-lg items-center">
          <NavLink href="/dashboard">Your Summaries</NavLink>
          <NavLink href="/upload">Upload a PDF</NavLink>
        </div>
      </SignedIn>

      {/* Right: Auth controls */}
      <div className="flex items-center gap-4">
        <SignedIn>
          <UserButton />
        </SignedIn>

        <SignedOut>
          <div className="flex items-center gap-3">
            <SignInButton mode="modal">
              <button className="bg-[#ec155d] hover:bg-[#d21352] text-white rounded-full px-5 py-2 text-sm font-medium transition">
                Sign In
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button className="bg-[#6c47ff] hover:bg-[#5b38e0] text-white rounded-full px-5 py-2 text-sm font-medium transition">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        </SignedOut>
      </div>
    </nav>
  )
}
