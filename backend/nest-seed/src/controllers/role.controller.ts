import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateRoleDTO, RoleDTO } from '../modules/role/role.dto';
import { RoleService } from '../modules/role/role.service';

@Controller('roles')
@ApiTags('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: RoleDTO,
    description: 'Returns RoleDTO',
  })
  create(@Body() createRoleDto: CreateRoleDTO): Promise<RoleDTO> {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: RoleDTO,
    isArray: true,
    description: 'Returns RoleDTO. An empty list in case of no record available',
  })
  list(): Promise<RoleDTO[]> {
    return this.roleService.list();
  }
}
