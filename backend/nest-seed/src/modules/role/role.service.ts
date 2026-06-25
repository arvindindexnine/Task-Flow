import { HttpStatus, Injectable } from '@nestjs/common';
import { logger, SeedException } from '@snap/core';
import { CreateRoleDTO, RoleDTO } from './role.dto';
import { Role } from './role.entity';
import { RoleRepository } from './role.repository';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async list(): Promise<RoleDTO[]> {
    const roles = await this.roleRepository.findAllRoles();

    const roleDtos: RoleDTO[] = [];

    roles.forEach((role) => {
      const roleDto = new RoleDTO();
      roleDto.id = role.id;
      roleDto.name = role.name;
      roleDtos.push(roleDto);
    });

    return roleDtos;
  }

  findByName(roleName: string): Promise<Role> {
    return this.roleRepository.findByName(roleName);
  }

  findByNames(roleNames: string[]): Promise<Role[]> {
    return this.roleRepository.findByNames(roleNames);
  }

  async create(createRoleDto: CreateRoleDTO): Promise<RoleDTO> {
    const { name } = createRoleDto;
    if (await this.roleRepository.findByName(name)) {
      logger.debug('Record already present!');
      throw new SeedException('Role already exists', HttpStatus.CONFLICT);
    }

    let role = { name } as Role;
    role = await this.roleRepository.saveRole(role);
    logger.info(`New role created: ${name}`);
    const { id } = role;
    return { id, name } as RoleDTO;
  }
}
