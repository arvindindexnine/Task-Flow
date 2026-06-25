---
description: Generate complete NestJS module boilerplate from SQL/YAML/Database schema following project conventions and constitutional requirements
---

The user input can be provided directly by the agent or as a command argument - you **MUST** consider it before proceeding with the prompt (if not empty).

User input:

$ARGUMENTS

## Prerequisites Validation

1. **Project Structure Validation**:
   - Verify `src/modules/` directory exists
   - Check for TypeORM and NestJS dependencies in `package.json`
   - Validate existing project patterns match expected structure

2. **Cursor Rules Validation**:
   - Load and validate `.cursor/rules/` directory exists
   - Parse `nestjs-patterns.mdc`, `project-structure.mdc`, `core-naming.mdc`
   - Extract project-specific validation patterns and conventions
   - Identify custom validators (e.g., `@IsIdentifier`, `@IsMobileNumber`, `@IsValidPassword`)

3. **Constitutional Compliance Check**:
   - Load `.specify/memory/constitution.md` if exists for governance rules
   - Ensure generated code follows constitutional requirements
   - Validate against project coding standards and principles

## Input Processing and Analysis

4. **Input File Processing**:
   - Parse file path from $ARGUMENTS (required parameter)
   - Validate file exists and is readable
   - Determine input type: SQL CREATE TABLE statements, YAML schema, or text description
   - Extract all table/entity definitions from input

5. **Entity Discovery**:
   - Parse table structures, columns, data types, constraints
   - Detect primary keys, foreign keys, indexes, unique constraints
   - Identify relationships (OneToMany, ManyToMany, ManyToOne)
   - List all entities found with their properties

6. **Existing Module Detection**:
   - Scan `src/modules/` for existing modules and entities
   - Check which entities already have modules or files
   - Identify potential conflicts or existing implementations
   - Map relationships to existing entities

## Interactive Entity Planning

7. **Entity Classification and Grouping**:
   - **Junction Tables**: Automatically detect tables with primarily foreign keys (typically 2 FKs, minimal additional columns)
   - **Related Entities**: Identify entities with strong relationships that could be grouped
   - **Standalone Entities**: Identify entities that should have their own modules
   - **Existing Entities**: Flag entities that already exist in the codebase

8. **Interactive Decision Making**:
   For each discovered entity, present options and get user confirmation:
   - **Junction Tables**: "Table [table_name] appears to be a junction table. Generate TypeORM relationship only? (y/n)"
   - **New Entities**: "Create new module for [EntityName]? (y/n)"
   - **Related Entities**: "Add [EntityName] to existing [ModuleName] module? (y/n)"
   - **Entity Grouping**: "Entities [Entity1, Entity2] seem related. Group in single module? (y/n)"
   - **Existing Entities**: "Entity [EntityName] already exists. Skip or overwrite? (skip/overwrite)"

9. **Relationship Confirmation**:
   - Display all detected relationships with their types and directions
   - Ask for confirmation: "Confirm relationship directions? (y/n)"
   - Allow user to modify relationship types if needed
   - Resolve any ambiguous or conflicting relationships

## Code Generation Workflow

10. **Generation Plan Execution**:
    Based on user decisions, generate only the confirmed components:
    - **New Modules**: Complete module structure with all files
    - **Entity Additions**: Add entities and repositories to existing modules
    - **Relationship Updates**: Add relationship definitions to existing entities
    - **Junction Tables**: Add relationship definitions only (no entity files)

11. **File Structure Generation**:
    For each new module, create:
    ```
    src/modules/<module>/
    ├── <module>.entity.ts        # TypeORM entity with relationships
    ├── <module>.module.ts        # NestJS module with DI setup
    ├── <module>.service.ts       # Empty service with repository injection
    ├── <module>.repository.ts    # Empty repository with TypeORM injection
    ├── <module>.dto.ts           # Empty DTO file with import comments
    ├── <module>.service.spec.ts  # Jest test scaffolding
    └── index.ts                  # Barrel exports
    ```

## File Generation Specifications

### Entity Files (`<module>.entity.ts`)

- Extend `Audit` base class from `../database-audit`
- Use TypeORM decorators following database naming conventions
- Snake_case column names with camelCase TypeScript properties
- Proper relationship decorators (OneToMany, ManyToMany, ManyToOne)
- Promise-wrapped relationship properties
- Appropriate `@JoinColumn` and `@JoinTable` configurations

### Controller Files (`<module>.controller.ts`)

- Injectable controller class with `@Controller()` decorator
- Class-level guards: `@UseGuards(JwtAuthGuard, PermissionGuard)`
- OpenAPI/Swagger decorators for documentation
- **No implementation methods** - empty controller class body

### Module Files (`<module>.module.ts`)

- NestJS `@Module()` decorator
- TypeORM feature imports: `TypeOrmModule.forFeature([Entity])`
- Providers array with service, repository, command handlers, query handlers
- Proper dependency imports from related modules
- Export service for other modules to use

### Service Files (`<module>.service.ts`)

- Injectable service class with `@Injectable()` decorator
- Constructor with repository and related service injections
- **No stub methods** - empty class body
- Proper imports and typing

### Repository Files (`<module>.repository.ts`)

- Injectable repository class with `@Injectable()` decorator
- Constructor with `@InjectRepository(Entity)` TypeORM injection
- **No stub methods** - empty class body
- Follow project repository patterns

### DTO Files (`<module>.dto.ts`)

- **Empty file** with import statements only
- Import validation decorators based on cursor rules
- Import API documentation decorators
- Comments indicating standard DTO patterns:
  ```typescript
  // Standard DTO patterns:
  // - CreateEntityDto: Input validation for creation
  // - UpdateEntityDto: Partial input for updates
  // - EntityResponseDto: Output formatting
  // - EntityDto: Internal data transfer
  ```

### Test Files (`<module>.service.spec.ts`)

- Jest test structure with describe blocks
- Service testing setup with mock dependencies
- Basic test scaffolding for service methods
- Mock repository and dependency injection setup

### Barrel Export Files (`index.ts`)

- Export all module components for clean imports
- Follow established project export patterns
- Maintain consistent public API surface

## Post-Generation Updates

12. **Module Registration**:
    - Add new modules to `src/app.module.ts` imports array
    - Update existing modules with new entities and repositories
    - Ensure proper dependency injection setup

13. **Barrel Export Updates**:
    - Update `src/modules/index.ts` with new module exports
    - Update module-level `index.ts` files
    - Maintain consistent export patterns across the project

14. **Existing Entity Updates**:
    - Add relationship properties to existing entities
    - Update imports in existing entity files
    - Ensure bidirectional relationships are properly configured

## Progress Tracking and Validation

15. **Progress Reporting**:
    - Report analysis completion with entity count
    - Track entity processing decisions
    - Report generation progress for each module
    - Confirm successful file creation with paths

16. **Validation Checkpoints**:
    - Verify all generated files follow naming conventions
    - Check TypeORM entity validation
    - Ensure proper import paths and dependencies
    - Validate generated code against cursor rules

17. **Migration Guidance**:
    - Suggest running TypeORM migration generation
    - Provide migration command: `npm run typeorm:migration:generate`
    - Warn about database schema changes required
    - List all new entities that need database tables

## Error Handling and Recovery

18. **Input Validation Errors**:
    - **Invalid file path**: Clear error with expected file formats
    - **Malformed input**: Specific parsing error with line numbers
    - **Missing dependencies**: List required packages and setup steps

19. **Generation Conflicts**:
    - **Naming conflicts**: Suggest alternative names or backup options
    - **Missing relationships**: List entities that need to be created first
    - **Circular dependencies**: Suggest relationship restructuring

20. **Recovery Instructions**:
    - **Partial failures**: List successfully created files and remaining tasks
    - **Permission errors**: Suggest file permission fixes
    - **Validation failures**: Detailed error messages with cursor rule references

## Completion Summary

21. **Final Report**:
    - Summary of generated modules and files
    - List of updated existing files
    - Database migration requirements
    - Next steps for implementation
    - Integration testing recommendations

## Example Interactive Flow

```
> @boilerplate ./database/user-management.sql

🔍 Prerequisites Check...
✅ Project structure validated
✅ Cursor rules loaded from .cursor/rules/
✅ Found validation patterns: @IsIdentifier, @IsMobileNumber, @IsValidPassword
✅ Constitutional requirements loaded

📋 Analyzing input file...
Found 5 entities: User, Role, UserRole, Permission, UserPermission

🔍 Checking existing modules...
✅ User module exists at src/modules/user/
✅ Role module exists at src/modules/role/
❌ Permission module not found
❌ UserRole entity not found
❌ UserPermission entity not found

📝 Entity Processing Plan:

1. UserRole table (user_id, role_id FKs detected)
   ❓ Appears to be junction table. Generate relationship only? (y/n): y
   → Will add ManyToMany relationship to User and Role entities

2. UserPermission table (user_id, permission_id FKs detected)
   ❓ Appears to be junction table. Generate relationship only? (y/n): y
   → Will add ManyToMany relationship to User and Permission entities

3. Permission entity
   ❓ Create new Permission module? (y/n): y
   → Will generate: Permission module, entity, controller, service, repository, DTOs, tests

🔗 Detected Relationships:
- User ↔ Role (ManyToMany via UserRole)
- User ↔ Permission (ManyToMany via UserPermission)
- Role ↔ Permission (potential ManyToMany - not in schema)

❓ Confirm relationship directions? (y/n): y

✅ Generating code...
- Updated User entity with Permission relationship
- Updated Role entity (no changes needed)
- Created Permission module with complete structure
- Generated Permission controller with REST endpoints
- Updated app.module.ts with Permission module import
- Updated barrel exports in src/modules/index.ts

📊 Generation Summary:
- 1 new module created: Permission
- 1 entity updated: User
- 8 new files generated
- 2 existing files updated

🔄 Next Steps:
1. Run: npm run typeorm:migration:generate --name=add-permission-tables
2. Review generated relationships in User entity
3. Implement Permission service methods as needed
4. Add Permission DTOs for your specific use case

🎉 Boilerplate generation completed successfully!
```

This command ensures consistent, project-compliant code generation while providing full control over entity organization and module structure through interactive confirmation, following established project patterns and constitutional requirements.
