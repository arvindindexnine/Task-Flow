# nodejs-nest-seed

This repo is meant for setting up a seed with nestjs framework of node.

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Local Setup

### Download and install for your platform

1. **Node.js and npm**: [Node.js Download](https://nodejs.org/en/download/)
2. **Git**: [Git SCM Download](https://git-scm.com/downloads)
3. **PostgreSQL**: [PostgreSQL Download](https://www.postgresql.org/download/)

## Running the app

1. Create Database: Open `pgAdmin` and create a Database called `nest_seed`. Refer [How To Create A Postgres Database Using pgAdmin](https://youtu.be/1wvDVBjNDys?t=3m37s)
2. Generate ssh keys: [Generate SSH keys for Git authorization](http://inchoo.net/dev-talk/how-to-generate-ssh-keys-for-git-authorization/)
3. Clone the project:

```bash
git clone git@gitlab.com:idx9-internal/nodejs-nest-seed.git`.
```

4. Go inside directory:

```bash
cd nodejs-nest-seed
```

5. Database Connection: Update the `.env.local` file to match your database connection details.
6. Build the Project:

```bash
npm install
```

7. Run the app

```bash
# Development watch mode
$ npm run start:local

# Webpack Hot Module Reloading
$ npm run start:hmr

# production mode
$ npm run start:prod
```

8. Run Tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

Automock is a standalone library for unit testing. Refer [Automock streamlines test development by automatically mocking class external dependencies..](https://docs.nestjs.com/recipes/automock)

## Environment specific configuration

Seed's environment configuration files can be found on root directory and named in following format:

```bash
.env.${env-name}
```

To set the runtime environment:

1. create environment file with above name syntax.
2. set `NODE_ENV` user variable in host. (In Docker based runtime environment variable can be pass in execution command).

## Run with Docker

To start app with docker compose for local development and debug purpose.

```bash
docker-compose up --build
```

Database can be accessed with client like pgAdmin on port `5555` with above credentials.

## TypeORM Migration

Migration classes are separate from the Nest application source code. Their lifecycle is maintained by the TypeORM CLI.
Migration configuration are separate from the typeorm configuration. It is defined in `typeorm-datasource.ts` file.

### Migration commands

Create an empty migration file

```bash
npm run migration:create -n < migration-name >
```

##### Note: This will create file in `root directory` with name `< Timestamp-migration-name >` containing empty `up` and `down` functions.

<br>

Generate migration from the entity files

```bash
npm run migration:generate -n < migration-name >
```

##### Note: This will generate file in `root directory` folder with name `< Timestamp-migration-name >` containing populated `up` and `down` functions with queries created using entities present `modules` folder.

<br>

Apply migration to database

```bash
npm run migration:run
```

Revert latest executed migration

```bash
npm run migration:revert
```

Apply Seed specific role migration to database

```bash
npm run migration:run && npm run migration:seed-run
```

#### Documentation

[https://typeorm.io/#/migrations](https://typeorm.io/#/migrations)

## Swagger API Documentation

### Test REST APIs with swagger

swagger APIs can be tested with **Try it out** option on swagger UI.

#### Pass authentication token to the APIs

1. Get authorization token by making call to `/auth/login` API.
2. Copy JWT token from the response.
3. Goto **Authorize** panel by clicking on Authorize button on top right corner and paste the token in value field with following pattern. After click on Authorize, the token will be set in the authentication context of the Swagger UI.

```text
Bearer <access-token>
```

#### Swagger UI Authentication

Swagger UI documentation is available on [http://localhost:3000/swagger-ui](http://localhost:3000/swagger-ui). By default swagger ui is protected with basic authentication with following credentials.

| UserName | Password  |
| -------- | --------- |
| root     | toor      |
| admin    | admin@123 |

Credentials are defined in `config.ts` file and can also be updated there.

#### Disable Swagger Documentation

Swagger UI documentation can also be enabled/disabled on specific deployed environment with the following flag defined in `config.ts`.

```javascript
...
swagger: {
        isEnabled: true,
        ...
    },
...

```

## Host Static content / Single page applications with seed

Seed can host SPA with REST APIs.

You can put static content inside `static-web/` directory.

The path and directory structure can be updated from the `app.module.ts` file:

```javascript
ServeStaticModule.forRoot({
  rootPath: join(__dirname, '..', 'static-web'),
});
```

## Request Logger(RequestMetaService)

We have added RequestMetaService for the debugging purpose & tracking user actions. To implement this we need to inject RequestMetaService in the constructor & call the method 'getRequestMeta' by passing request object.

```bash
constructor(
    private requestMetaService: RequestMetaService,
  ) {}

const requestMeta: RequestMeta =
      await this.requestMetaService.getRequestMeta(request);
```

Please refer RequestMeta class to see what data we get, additionally anyone can update as per need.
This requestMeta object can be passed to multiple functions to track user actions & debug with email, requestId, sessionId, originalUrl etc.

## Pagination Support

For pagination we can use PaginationDto as query parameter & use 'Pager' class as property inside existing response DTO.

For detailed example of how to implement pagination in nest js, please refer implementation of geAllUsers API from user.controller.ts file.
Please refer Metadata response format below to see example of pagination.

## Metadata feature for getting response time to the clients

By enabling Metadata feature through setting a property in config.ts file - "enableMetaData: true," will transform the response in below format. Along with existing payload metadata object will be added in all the responses of the APIs. You can disable this by setting false value

```bash
{
  "data": {
    "users": [
      {
        "email": "md@wqw.wq",
        "id": 2
      }
    ],
    "pager": {
      "totalItems": 3,
      "currentPage": 1,
      "limit": 1,
      "startIndex": 0,
      "totalPages": 3,
      "pages": [
        1,
        2,
        3
      ]
    }
  },
  "metadata": {
    "startTime": 1630936298254,
    "endTime": 1630936298368,
    "apiProcessingTime": "114 ms"
  }
}
```

## Rate Limit Guard

A Rate Limit Guard counts and limits number of actions by key and protects from DDoS and brute force attacks at any scale.
We can track the requests per IP address. We can use this on the APIs where any user authentication (auth token) is not provided.
Such as while creating a new user (POST users), we don't have any user auth yet so we can add the Rate Limit Guard for a safer side.
It will allow a user to call POST users API within the defined times only.
Library documentation - https://www.npmjs.com/package/rate-limiter-flexible

## Linting and Code Formatting

We have configured eslint for linting and prettier for the file formatting.

### NPM Script command for linting check, fix and code formatting

```bash
npm run lint

npm run lint:fix
```

Linting check is configured with every npm start script. Start script will fail if there is any linting error.

#### VS code workspace setting

VSCode local workspace settings are configured in

```json
.vscode/settings.json
```

As of now settings for save actions are specified. You can extend it as per your project/team requirement.

## Logging

We have configured winston logger for logging purpose which can be used across application. This will create a file named - "application-{date}-logs.log".

### Usage - Adding various logs for debugging

```bash
import { logger } from '../../config/app-logger.config';

...

logger.debug('Add debug logs here', anyObjectToDebug);

logger.info('Add info logs here', anyObjectToDebug);

logger.error('Add error logs here', anyObjectToDebug);
```

## Debugging

To enable debugger for this Nest.js based seed project, do as below (Tested in VSCode IDE):

1. Goto "Run" menu --> "Start Debugging"
2. In dropdown choose "Node.js" based debugging
3. It should automatically pick the "/.vscode/launch.json" and start the debugger using the configuration inside this json.
4. On the "Run and Debug" left-side pane, you can confirm by seeing the debugger options of "Step over", etc.

## Metadata insertion and removal in database using TypeORM Migration

<br>
We have added metadata inserting into the database. It will be very helpful while some prepopulated data we needed for use in our application. we don't need to add it manually.
<br>
<br>

#### Following are steps for metadata insertion:

<br />

`Step 1 ` Create folder in named `seed-migration` in src folder.

`Step 2 ` Create file named `typeorm-seed-datasource.ts` in src folder same like `typeorm-datasource.ts`.

`Step 3 ` Copy all code from `typeorm-datasource.ts` to `typeorm-seed-datasource.ts` just change following path and
change ` "migrations": [
      "src/migration/**/*.ts"
   ]`,
to `migrations": [
      "src/seed-migration/**/*.ts"
   ]`.

`Step 4 ` Add this `"typeorm:seed": "node --require ts-node/register ./node_modules/typeorm/cli.js -d ./src/typeorm-seed-datasource.ts",` into package.json scripts.

`Step 5 ` We need to create one seed file in any specific location of folder in seed we added master folder and added file named `role-seed.ts`
Example:

```bash
export const RoleSeed = [{ name: 'USER' }, { name: 'ADMIN' }];
```

`Step 6 ` Run the following command to create file.

```bash
npm run seed:migration:generate -n < seed-migration-name >
```

It will create file in `root directory` folder with `< Timestamp-seed-migration-name >` you need to open file and remove all code from `up` function and add the following lines.

```bash
  public async up(): Promise<void> {
    await this.insertNewRecord('table name', seed file);
    example: await this.insertNewRecord('role', RoleSeed);
  }
```

also add following two function in your migration file it will check and insert records to role table.

```bash
  async insertNewRecord(table: EntityTarget<ObjectLiteral>, seedData: { name: string }[]): Promise<void> {
    for (const data of seedData) {
      const isRecordExist = await this.findByName(table, data);
      if (!isRecordExist) {
        const repository = datasource.getRepository(table);
        const roleType = repository.create(data);
        await repository.save(roleType);
      }
    }
  }

  async findByName(table: EntityTarget<ObjectLiteral>, data: FindOptionsWhere<ObjectLiteral> | FindOptionsWhere<ObjectLiteral>[]): Promise<boolean> {
    const result = await datasource.getRepository(table).findOneBy(data);
    return result ? true : false;
  }
```

`Step 7 ` Move `<Timestamp-seed-migration-name> ` to `seed-migration` folder.

`Step 8 ` You need run following command to perform the migration and insert data into your database.

```bash
npm run migration:seed-run
```

#### Following are steps for metadata removal:

<br />

`Step 1 ` Open `< Timestamp-seed-migration-name >` and in `up` function and add the following lines.

```bash
  public async down(): Promise<void> {
    example: datasource.query(`TRUNCATE TABLE "table name" CASCADE`);
    await datasource.query(`TRUNCATE TABLE "role" CASCADE`);
  }
```

`Step 2 ` You need run following command to undo the migration.

```bash
npm run migration:seed-revert
```

## Healthchecks

A service has an health check API endpoint (e.g. HTTP /health) that returns the health of the service. The API endpoint handler performs various checks, such as

- Check application status
- Check database status
- Check disk space
- Check Heap memory space
- Check process consumed memory(RAM)
- Check Redis, Third party services

A health check client - a monitoring service, service registry or load balancer - periodically invokes the endpoint to check the health of the service instance.

We have used [Terminus nestjs](https://docs.nestjs.com/recipes/terminus) library for healchecks API. To get started with @nestjs/terminus we need to install the required dependency.

```bash
npm install --save @nestjs/terminus
```

```bash
npm i --save @nestjs/axios axios
```

**Localhost healthcheck**

```bash
http://localhost:3000/health
```

**Sample response of healthcheck API**

```bash
{
  "status": "error",
  "info": {
    "application": {
      "status": "up"
    },
    "database": {
      "status": "up"
    }
  },
  "error": {
    "storage_space": {
      "status": "down",
      "message": "Used disk storage exceeded the set threshold"
    }
  },
  "details": {
    "application": {
      "status": "up"
    },
    "database": {
      "status": "up"
    }
  }
}
```

## Permissions and Authorization

This section explains how to use the @Permission decorator, @SkipAuth, and how to define roles and permission mapping.

### @Permissions Decorator

The @Permissions decorator is used to define the permissions required to access a route. The decorator takes a list of permissions as arguments. If the user has any of the permissions, they will be allowed to access the route.

```typescript
import { PermissionGuard, Permissions } from '../modules';

@Controller('example')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class ExampleController {
  @Get()
  @Permissions({ resource: 'user', action: 'get' })
  getExample() {
    // Your code here
  }

  @Post()
  @Permissions({ resource: 'user', action: 'create' })
  createExample() {
    // Your code here
  }
}
```

### @SkipAuth Decorator

The @SkipAuth decorator is used to bypass authentication for specific routes or controller methods. This is useful for specific routes in controller that do not require Authentication.

```typescript
import { PermissionGuard, Permissions, SkipAuth } from '../modules';

@Controller('example')
@UseGuards(PermissionGuard)
export class ExampleController {
  @Get()
  @Permissions({ resource: 'user', action: 'get' })
  getExample() {
    // Your code here
  }

  @Post()
  @SkipAuth()
  createExample() {
    // Your code here
  }
}
```

### Defining Roles and Permission Mapping

You can define roles and their corresponding permissions in the `config.ts` file. This configuration will be used to manage access control throughout your application.

_Example Configuration_

```typescript
export const config = (): any => ({
  // ... Other configurations
  roleBasedAccess: [
    {
      role: 'ADMIN',
      permissions: [{ resource: 'user', action: '*' }],
    },
    {
      role: 'USER',
      permissions: [
        { resource: 'user', action: 'get' },
        { resource: 'user', action: 'create' },
      ],
    },
  ],
});
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - Aashish Singla
- Contributors - Akshay Pethani

## License

Nest is [MIT licensed](LICENSE).
