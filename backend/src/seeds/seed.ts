import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Brand } from '../brands/entities/brand.entity';
import { Category } from '../categories/entities/category.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [Brand, Category],
  synchronize: true,
});

const brands: Array<Pick<Brand, 'name' | 'slug'>> = [
  { name: 'Apple', slug: 'apple' },
  { name: 'Samsung', slug: 'samsung' },
  { name: 'Sony', slug: 'sony' },
  { name: 'Microsoft', slug: 'microsoft' },
  { name: 'Nintendo', slug: 'nintendo' },
  { name: 'Xiaomi', slug: 'xiaomi' },
  { name: 'ASUS', slug: 'asus' },
  { name: 'Dell', slug: 'dell' },
  { name: 'HP', slug: 'hp' },
  { name: 'Lenovo', slug: 'lenovo' },
];

const categories: Array<Pick<Category, 'name' | 'slug'>> = [
  { name: 'Telefonos', slug: 'telefonos' },
  { name: 'Consolas', slug: 'consolas' },
  { name: 'Gaming', slug: 'gaming' },
  { name: 'Computadoras', slug: 'computadoras' },
  { name: 'Smartwatches', slug: 'smartwatches' },
  { name: 'Camaras', slug: 'camaras' },
  { name: 'Audifonos', slug: 'audifonos' },
  { name: 'Tablets', slug: 'tablets' },
  { name: 'Accesorios', slug: 'accesorios' },
];

async function seed() {
  await dataSource.initialize();

  const brandRepo = dataSource.getRepository(Brand);
  const categoryRepo = dataSource.getRepository(Category);

  await brandRepo.upsert(brands, ['slug']);
  await categoryRepo.upsert(categories, ['slug']);

  await dataSource.destroy();

  // eslint-disable-next-line no-console
  console.log('Seed completado: marcas y categorias.');
}

seed().catch(async (error) => {
  // eslint-disable-next-line no-console
  console.error('Seed fallido', error);
  await dataSource.destroy();
  process.exit(1);
});
