import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RoleRepository {
  constructor(@InjectRepository(Role) private readonly roleRepository: Repository<Role>) {}

  findAllRoles(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  findByName(roleName: string): Promise<Role> {
    return this.roleRepository.findOne({ where: { name: roleName } });
  }

  findByNames(roleNames: string[]): Promise<Role[]> {
    return this.roleRepository.createQueryBuilder('role').where('role.name IN(:...roleNames)', { roleNames }).getMany();
  }

  saveRole(role: Role): Promise<Role> {
    return this.roleRepository.save(role);
  }
}
