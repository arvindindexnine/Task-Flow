import { EntityTarget, FindOptionsWhere, MigrationInterface, ObjectLiteral } from 'typeorm';
import { RoleSeed } from '../master-data/role-seed';
import { datasource } from '../typeorm-seed-datasource';

export const masterRoleData = RoleSeed;

export class MasterRoleSeed1674550127184 implements MigrationInterface {
  name = 'MasterRoleSeed1674550127184';

  public async up(): Promise<void> {
    await this.insert('role', masterRoleData);
  }

  public async down(): Promise<void> {
    await datasource.query(`TRUNCATE TABLE "role" CASCADE`);
  }

  async insert(table: EntityTarget<ObjectLiteral>, seedData: { name: string }[]): Promise<void> {
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
}
