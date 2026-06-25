// eslint-disable-next-line @typescript-eslint/no-var-requires
const sonarqubeScanner = require('sonarqube-scanner');

sonarqubeScanner(
  {
    serverUrl: 'https://qube.idxnine.com',
    login: 'sqp_eabbf546139514ab59d0a41e40b70e0e4195f707',
    options: {
      'sonar.projectName': 'NestJS Seed',
      'sonar.projectKey': 'nestjs-seed',
      'sonar.sources': 'src',
      'sonar.tests': 'src',
      'sonar.typescript.lcov.reportPaths': 'coverage/lcov.info',
      'sonar.exclusions': '**/__tests__/**,src/environments/*,src/app/*.module.ts,src/app/**/*.module.ts,dist/**',
      'sonar.test.inclusions': 'src/**/*.spec.tsx,src/**/*.spec.ts',
    },
  },
  () => process.exit(),
);
