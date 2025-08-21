require('@testing-library/jest-dom')

// Mock variables d'environnement
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001'
process.env.API_BASE_URL = 'http://localhost:3001'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
  redirect: jest.fn(),
}))

// Mock AuthContext
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { 
      id: '1', 
      email: 'test@conexa.com', 
      role: 'CLIENT', 
      fullName: 'Test User' 
    },
    token: 'mock-token',
    login: jest.fn(),
    logout: jest.fn(),
    isLoading: false,
  }),
  AuthProvider: ({ children }) => children,
}))

// Mock API calls
global.fetch = jest.fn()

// Mock window.location pour les tests qui utilisent logout
if (typeof window.location === 'undefined') {
  Object.defineProperty(window, 'location', {
    value: {
      href: 'http://localhost:3000',
      assign: jest.fn(),
      reload: jest.fn(),
      replace: jest.fn()
    },
    writable: true,
    configurable: true
  })
} else {
  // Si location existe déjà, on mock juste les méthodes
  window.location.assign = jest.fn()
  window.location.reload = jest.fn()
  window.location.replace = jest.fn()
}

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})
global.localStorage = localStorageMock

// Mock par défaut pour localStorage.getItem
beforeEach(() => {
  localStorageMock.getItem.mockReturnValue(null)
  localStorageMock.setItem.mockClear()
  localStorageMock.removeItem.mockClear()
  localStorageMock.clear.mockClear()
})

// Mock console.error pour éviter les logs de test
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    // Ignorer les warnings React
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    
    // Ignorer les erreurs de navigation JSDOM (normales en tests)
    if (args[0] && typeof args[0] === 'object' && args[0].type === 'not implemented') {
      return
    }
    
    // Ignorer les erreurs de test intentionnelles 
    if (args[0] && typeof args[0] === 'string') {
      if (args[0].includes('Erreur lors du chargement') || 
          args[0].includes('Erreur lors de la récupération') ||
          args[0].includes('Erreur de réseau')) {
        return
      }
    }
    
    // Ignorer les erreurs d'objet Error en test
    if (args[0] instanceof Error) {
      if (args[0].message.includes('Erreur lors de la récupération') ||
          args[0].message.includes('Erreur de réseau')) {
        return
      }
    }
    
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
