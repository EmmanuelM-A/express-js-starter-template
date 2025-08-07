export default {
    testMatch: [
        '**/tests/**/*.test.js',
        '**/tests/**/*.test.mjs'
    ],
    collectCoverageFrom: [
        'src/**/*.js',
        'src/**/*.mjs',
        '!src/**/*.test.js',
        '!src/**/*.test.mjs'
    ],
    transform: {},
    testEnvironment: 'node'
}