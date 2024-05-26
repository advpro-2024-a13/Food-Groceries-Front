'use client'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { ShoppingCart, HomeIcon, Wallet, Star, Store, Clock } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useThemeContext } from '@/components/contexts/ThemeContext'
import { Button } from '@/components/ui/button'
import { useAuthContext } from '@/components/contexts/AuthContext'

const Navbar = () => {
  const { theme, handleTheme } = useThemeContext()
  const { isAuthenticated, logout } = useAuthContext()
  const localPengguna = JSON.parse(localStorage.getItem('Pengguna') || '{}')
  const role = localPengguna.role

  const daftarNavList = isAuthenticated
    ? role === 'ROLE_PEMBELI'
      ? [
          {
            url: '/shop',
            name: 'Shop',
            icon: ShoppingCart,
          },
          {
            url: '/balance',
            name: 'Balance',
            icon: Wallet,
          },
          {
            url: '/rating',
            name: 'My Rating',
            icon: Star,
          },
          {
            url: '/history',
            name: 'History',
            icon: Clock,
          },
          {
            url: '/',
            name: 'Home',
            icon: HomeIcon,
          },
        ]
      : role === 'ROLE_PENGELOLA'
        ? [
            {
              url: '/',
              name: 'Home',
              icon: HomeIcon,
            },
            {
              url: '/manage',
              name: 'Manage Supermarket',
              icon: ShoppingCart,
            },
          ]
        : [
            {
              url: '/',
              name: 'Home',
              icon: HomeIcon,
            },
          ]
    : [
        {
          url: '/',
          name: 'Home',
          icon: HomeIcon,
        },
      ]

  return (
    <div className="flex justify-between z-50 fixed w-[90%] left-1/2 -translate-x-1/2 top-2 p-4 bg-slate-500 bg-opacity-10 rounded-xl backdrop-blur-md">
      <NavigationMenu>
        <NavigationMenuList className="flex items-center gap-4">
          <NavigationMenuItem></NavigationMenuItem>

          {daftarNavList.map((daftar, index) => {
            const Icon = daftar.icon

            return (
              <NavigationMenuItem key={index}>
                <Link href={daftar.url}>
                  <NavigationMenuLink className="flex items-center gap-2">
                    {Icon && <Icon />}
                    {daftar.name}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )
          })}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="theme-mode"
            checked={theme == 'light'}
            onClick={handleTheme}
          />
          <Label htmlFor="theme-mode">Theme</Label>
        </div>

        {!isAuthenticated && (
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        )}

        {isAuthenticated && <Button onClick={logout}>Logout</Button>}
      </div>
    </div>
  )
}

export default Navbar
