module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    modulePaths: ['<rootDir>/src'],
    setupFiles: ['reflect-metadata'],
    rootDir: '.',
    moduleNameMapper: {
        '^@/(.*)$': ['<rootDir>/src/$1', '<rootDir>/tests/$1'],
    },
    testMatch: ['<rootDir>/tests/**/*.spec.ts'],
    collectCoverageFrom: ['src/**/*.ts', '!src/**/*.spec.ts'],
    transform: {
        '^.+\\.(ts|js)$': [
            'ts-jest',
            {
                useESM: true,
            },
        ],
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    transformIgnorePatterns: ['node_modules/(?!(@faker-js/faker)/)'],
};
