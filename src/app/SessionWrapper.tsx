'use client'

import { SessionProvider, SessionProviderProps } from 'next-auth/react'
import { ReactNode } from 'react'

interface ExtendedSessionProviderProps extends SessionProviderProps {
  children: ReactNode;
}

export default function SessionWrapper({
  children,
  basePath,
  baseUrl,
  refetchInterval,
  refetchOnWindowFocus,
  refetchWhenOffline,
  session,
}: ExtendedSessionProviderProps) {
  return (
    <SessionProvider
      basePath={basePath}
      baseUrl={baseUrl}
      refetchInterval={refetchInterval}
      refetchOnWindowFocus={refetchOnWindowFocus}
      refetchWhenOffline={refetchWhenOffline}
      session={session}
    >
      {children}
    </SessionProvider>
  )
}