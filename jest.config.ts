import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.jest.json',
    }],
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/__mocks__/'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/components/ui/**',
    '!src/app/**/layout.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
}

export default config
