import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CreateRoleDTO } from './role.dto';
import { Role } from './role.entity';
import { RoleRepository } from './role.repository';
import { RoleService } from './role.service';

const mockRole: Role = { id: 1, name: 'admin' } as Role;
const createRoleDto: CreateRoleDTO = { name: 'admin' };

describe('RoleService', () => {
  let service: RoleService;
  let repository: Partial<RoleRepository>;

  beforeEach(async () => {
    repository = {
      findAllRoles: jest.fn().mockResolvedValue([mockRole]),
      findByName: jest.fn().mockResolvedValue(null),
      findByNames: jest.fn().mockResolvedValue([mockRole]),
      saveRole: jest.fn().mockResolvedValue(mockRole),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleService, { provide: RoleRepository, useValue: repository }],
    }).compile();

    service = module.get<RoleService>(RoleService);
  });

  it('should list all roles as DTOs', async () => {
    const result = await service.list();
    expect(repository.findAllRoles).toHaveBeenCalled();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe(mockRole.name);
  });

  it('should create a new role and return DTO', async () => {
    const result = await service.create(createRoleDto);
    expect(repository.findByName).toHaveBeenCalledWith(createRoleDto.name);
    expect(repository.saveRole).toHaveBeenCalled();
    expect(result.name).toBe(createRoleDto.name);
  });

  it('should throw CONFLICT if role already exists', async () => {
    repository.findByName = jest.fn().mockResolvedValue(mockRole);
    await expect(service.create(createRoleDto)).rejects.toMatchObject({
      status: HttpStatus.CONFLICT,
    });
  });

  it('should find role by name', async () => {
    repository.findByName = jest.fn().mockResolvedValue(mockRole);
    const result = await service.findByName('admin');
    expect(result).toEqual(mockRole);
  });

  it('should find roles by names', async () => {
    const result = await service.findByNames(['admin']);
    expect(result).toEqual([mockRole]);
  });
});
