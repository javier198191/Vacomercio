import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

// Manual .env parser to load env variables from the root .env file
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  for (const line of envConfig.split('\n')) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      // Remove surrounding quotes if any
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  }
}

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding user: user-1...');
  
  const user = await prisma.user.upsert({
    where: { id: 'user-1' },
    update: {},
    create: {
      id: 'user-1',
      nombre: 'Usuario Temporal',
      tipo: 'GANADERO',
      departamento: 'Antioquia',
      municipio: 'Medellin',
      telefono: '3001234567',
      finca_nombre: 'Finca Temporal',
      verificado: true,
      reputacion_promedio: 5.0,
    },
  });

  console.log('Successfully seeded user in database:', user);
}

main()
  .catch((e) => {
    console.error('Error seeding user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
