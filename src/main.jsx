import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 10 * 60 * 1000,   // data stays fresh for 10 minutes
      gcTime: 15 * 60 * 1000,      // cache kept for 15 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient} >
    <App />
    <Toaster position="top-right" />
  </QueryClientProvider>
)
