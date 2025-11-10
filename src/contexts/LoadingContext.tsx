import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { loadingConfig } from '../config/loading.config'

interface LoadingContextType {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  startLoading: () => void
  stopLoading: () => void
  animationSpeed: 'normal' | 'fast'
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(!loadingConfig.skipInDev)
  const [hasLoadedOnce, setHasLoadedOnce] = useState<boolean>(loadingConfig.skipInDev)

  useEffect(() => {
    if (!hasLoadedOnce && !loadingConfig.skipInDev) {
      const minLoadTime = setTimeout(() => {
        setIsLoading(false)
        setHasLoadedOnce(true)
      }, loadingConfig.minLoadTime)

      return () => clearTimeout(minLoadTime)
    }
  }, [hasLoadedOnce])

  const startLoading = () => setIsLoading(true)
  const stopLoading = () => setIsLoading(false)
  const animationSpeed = loadingConfig.animationSpeed

  return (
    <LoadingContext.Provider 
      value={{ 
        isLoading, 
        setIsLoading, 
        startLoading, 
        stopLoading, 
        animationSpeed 
      }}
    >
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading must be used within LoadingProvider')
  }
  return context
}