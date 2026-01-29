// backend/src/prisma.service.ts

import { Injectable, OnModuleInit } from '@nestjs/common';
// Para manejar la conexión a la base de datos
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
