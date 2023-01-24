module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    // needed to import with '.js' prefix
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1'
    },
    transform: {
        '^.+\\.[t|j]sx?$': [
            'babel-jest',
            {
                'configFile': './.babelrc.jest.js'
            }
        ]
    },
    modulePathIgnorePatterns: ['<rootDir>/target/']
}