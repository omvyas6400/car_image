export const loadingConfig = {
  // Skip luxury loader in development for faster testing
  skipInDev: import.meta.env.DEV && false, // Set to true to skip in dev
  
  // Minimum loading time (ms)
  minLoadTime: import.meta.env.PROD ? 2000 : 1000,
  
  // Show upload loader
  showUploadLoader: true,
  
  // Animation speeds
  animationSpeed: import.meta.env.PROD ? 'normal' : 'fast' as 'normal' | 'fast',
}