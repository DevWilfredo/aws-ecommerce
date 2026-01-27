import 'reflect-metadata';
import { join } from 'path';
import { readFile } from 'fs/promises';
import { randomUUID } from 'crypto';
import { config } from 'dotenv';
import { DataSource, In } from 'typeorm';
import { Brand } from '../brands/entities/brand.entity';
import { Category } from '../categories/entities/category.entity';
import { Product } from '../products/entities/product.entity';
import { ProductImage } from '../products/entities/product-image.entity';
import { ProductAttributeValue } from '../products/entities/product-attribute-value.entity';
import {
  AttributeDefinition,
  AttributeDataType,
} from '../products/entities/attribute-definition.entity';
import { OptionGroup } from '../products/entities/option-group.entity';
import { OptionValue } from '../products/entities/option-value.entity';

config({ path: join(__dirname, '../../.env') });

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [
    Brand,
    Category,
    Product,
    ProductImage,
    ProductAttributeValue,
    AttributeDefinition,
    OptionGroup,
    OptionValue,
  ],
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

const attributeDefinitionsByCategory: Record<
  string,
  Array<{
    name: string;
    unit?: string;
    dataType: AttributeDataType;
  }>
> = {
  telefonos: [
    { name: 'Pantalla', unit: 'pulgadas', dataType: AttributeDataType.Number },
    { name: 'Bateria', unit: 'mAh', dataType: AttributeDataType.Number },
    {
      name: 'Camara principal',
      unit: 'MP',
      dataType: AttributeDataType.Number,
    },
    { name: 'RAM', unit: 'GB', dataType: AttributeDataType.Number },
    { name: 'Procesador', dataType: AttributeDataType.Text },
    { name: 'Almacenamiento', unit: 'GB', dataType: AttributeDataType.Number },
    { name: 'Tasa refresco', unit: 'Hz', dataType: AttributeDataType.Number },
    { name: '5G', dataType: AttributeDataType.Boolean },
    { name: 'NFC', dataType: AttributeDataType.Boolean },
    { name: 'Resistencia agua', dataType: AttributeDataType.Text },
    { name: 'Sistema operativo', dataType: AttributeDataType.Text },
  ],
  consolas: [
    { name: 'CPU', dataType: AttributeDataType.Text },
    { name: 'GPU', dataType: AttributeDataType.Text },
    { name: 'RAM', unit: 'GB', dataType: AttributeDataType.Number },
    { name: 'Almacenamiento', unit: 'GB', dataType: AttributeDataType.Number },
    { name: 'Resolucion', dataType: AttributeDataType.Text },
    { name: 'FPS', unit: 'fps', dataType: AttributeDataType.Number },
    { name: 'Salida video', dataType: AttributeDataType.Text },
    { name: 'Incluye control', dataType: AttributeDataType.Boolean },
  ],
  gaming: [
    { name: 'Tipo', dataType: AttributeDataType.Text },
    { name: 'Compatibilidad', dataType: AttributeDataType.Text },
    { name: 'Conexion', dataType: AttributeDataType.Text },
    { name: 'RGB', dataType: AttributeDataType.Boolean },
    { name: 'Peso', unit: 'g', dataType: AttributeDataType.Number },
    { name: 'Frecuencia', unit: 'Hz', dataType: AttributeDataType.Number },
  ],
  computadoras: [
    { name: 'Procesador', dataType: AttributeDataType.Text },
    { name: 'RAM', unit: 'GB', dataType: AttributeDataType.Number },
    { name: 'Almacenamiento', unit: 'GB', dataType: AttributeDataType.Number },
    { name: 'GPU', dataType: AttributeDataType.Text },
    { name: 'Pantalla', unit: 'pulgadas', dataType: AttributeDataType.Number },
    { name: 'Resolucion', dataType: AttributeDataType.Text },
    { name: 'Bateria', unit: 'mAh', dataType: AttributeDataType.Number },
    { name: 'Sistema operativo', dataType: AttributeDataType.Text },
    { name: 'Peso', unit: 'kg', dataType: AttributeDataType.Number },
  ],
  smartwatches: [
    { name: 'Pantalla', unit: 'pulgadas', dataType: AttributeDataType.Number },
    { name: 'Bateria', unit: 'mAh', dataType: AttributeDataType.Number },
    { name: 'Resistencia agua', dataType: AttributeDataType.Text },
    { name: 'GPS', dataType: AttributeDataType.Boolean },
    { name: 'NFC', dataType: AttributeDataType.Boolean },
    { name: 'Sistema operativo', dataType: AttributeDataType.Text },
    { name: 'Compatibilidad', dataType: AttributeDataType.Text },
  ],
  camaras: [
    { name: 'Resolucion', unit: 'MP', dataType: AttributeDataType.Number },
    { name: 'Sensor', dataType: AttributeDataType.Text },
    { name: 'ISO', dataType: AttributeDataType.Text },
    { name: 'Video', dataType: AttributeDataType.Text },
    { name: 'Montura', dataType: AttributeDataType.Text },
    { name: 'Estabilizacion', dataType: AttributeDataType.Boolean },
    { name: 'Pantalla', unit: 'pulgadas', dataType: AttributeDataType.Number },
  ],
  audifonos: [
    { name: 'Tipo', dataType: AttributeDataType.Text },
    { name: 'Cancelacion ruido', dataType: AttributeDataType.Boolean },
    { name: 'Bluetooth', dataType: AttributeDataType.Text },
    { name: 'Bateria', unit: 'horas', dataType: AttributeDataType.Number },
    { name: 'Microfono', dataType: AttributeDataType.Boolean },
    { name: 'Impedancia', unit: 'ohms', dataType: AttributeDataType.Number },
  ],
  tablets: [
    { name: 'Pantalla', unit: 'pulgadas', dataType: AttributeDataType.Number },
    { name: 'Bateria', unit: 'mAh', dataType: AttributeDataType.Number },
    { name: 'RAM', unit: 'GB', dataType: AttributeDataType.Number },
    { name: 'Almacenamiento', unit: 'GB', dataType: AttributeDataType.Number },
    { name: 'Procesador', dataType: AttributeDataType.Text },
    { name: 'Sistema operativo', dataType: AttributeDataType.Text },
    { name: 'LTE', dataType: AttributeDataType.Boolean },
  ],
  accesorios: [
    { name: 'Compatibilidad', dataType: AttributeDataType.Text },
    { name: 'Material', dataType: AttributeDataType.Text },
    { name: 'Longitud', unit: 'cm', dataType: AttributeDataType.Number },
    { name: 'Inalambrico', dataType: AttributeDataType.Boolean },
    { name: 'Potencia', unit: 'W', dataType: AttributeDataType.Number },
  ],
};

const optionGroupsByCategory: Record<
  string,
  Array<{
    name: string;
    description?: string;
    values: Array<{ label: string; priceAdjustment?: number }>;
  }>
> = {
  telefonos: [
    {
      name: 'Color',
      description: 'Colores disponibles',
      values: [
        { label: 'Negro', priceAdjustment: 0 },
        { label: 'Blanco', priceAdjustment: 0 },
        { label: 'Azul', priceAdjustment: 0 },
        { label: 'Rojo', priceAdjustment: 0 },
        { label: 'Titanio natural', priceAdjustment: 50 },
      ],
    },
    {
      name: 'Almacenamiento',
      description: 'Capacidad interna',
      values: [
        { label: '128 GB', priceAdjustment: 0 },
        { label: '256 GB', priceAdjustment: 100 },
        { label: '512 GB', priceAdjustment: 250 },
        { label: '1 TB', priceAdjustment: 450 },
      ],
    },
    {
      name: 'SIM',
      description: 'Tipo de SIM',
      values: [{ label: 'Dual SIM' }, { label: 'eSIM' }],
    },
  ],
  consolas: [
    {
      name: 'Edicion',
      description: 'Edicion de la consola',
      values: [{ label: 'Standard' }, { label: 'Digital' }],
    },
    {
      name: 'Bundle',
      description: 'Incluye juego',
      values: [{ label: 'Sin juego' }, { label: 'Con juego', priceAdjustment: 60 }],
    },
    {
      name: 'Almacenamiento',
      description: 'Capacidad interna',
      values: [
        { label: '512 GB', priceAdjustment: 0 },
        { label: '1 TB', priceAdjustment: 120 },
      ],
    },
  ],
  gaming: [
    {
      name: 'Color',
      values: [{ label: 'Negro' }, { label: 'Blanco' }, { label: 'Rojo' }],
    },
    {
      name: 'Conexion',
      values: [{ label: 'USB' }, { label: 'Bluetooth' }, { label: 'Wireless' }],
    },
    {
      name: 'Switch',
      values: [{ label: 'Mecanico' }, { label: 'Membrana' }],
    },
  ],
  computadoras: [
    {
      name: 'Color',
      values: [
        { label: 'Negro' },
        { label: 'Gris' },
        { label: 'Plateado' },
      ],
    },
    {
      name: 'Teclado',
      values: [{ label: 'ES' }, { label: 'US' }],
    },
    {
      name: 'Almacenamiento',
      values: [
        { label: '512 GB SSD', priceAdjustment: 0 },
        { label: '1 TB SSD', priceAdjustment: 150 },
      ],
    },
  ],
  smartwatches: [
    {
      name: 'Color',
      values: [{ label: 'Negro' }, { label: 'Plata' }, { label: 'Oro' }],
    },
    {
      name: 'Talla de correa',
      values: [{ label: 'S/M' }, { label: 'M/L' }],
    },
    {
      name: 'Correa',
      values: [{ label: 'Silicona' }, { label: 'Cuero' }, { label: 'Metal' }],
    },
  ],
  camaras: [
    {
      name: 'Kit',
      description: 'Incluye lente',
      values: [
        { label: 'Solo cuerpo' },
        { label: 'Kit con lente', priceAdjustment: 200 },
      ],
    },
    {
      name: 'Color',
      values: [{ label: 'Negro' }, { label: 'Plata' }],
    },
  ],
  audifonos: [
    {
      name: 'Color',
      values: [{ label: 'Negro' }, { label: 'Blanco' }, { label: 'Azul' }],
    },
    {
      name: 'Conexion',
      values: [{ label: 'Bluetooth' }, { label: 'Jack 3.5mm' }, { label: 'USB-C' }],
    },
  ],
  tablets: [
    {
      name: 'Color',
      values: [{ label: 'Gris' }, { label: 'Plata' }, { label: 'Azul' }],
    },
    {
      name: 'Almacenamiento',
      values: [
        { label: '64 GB', priceAdjustment: 0 },
        { label: '128 GB', priceAdjustment: 80 },
        { label: '256 GB', priceAdjustment: 180 },
        { label: '512 GB', priceAdjustment: 320 },
      ],
    },
    {
      name: 'Conectividad',
      values: [{ label: 'WiFi' }, { label: 'WiFi + LTE', priceAdjustment: 120 }],
    },
  ],
  accesorios: [
    {
      name: 'Color',
      values: [{ label: 'Negro' }, { label: 'Blanco' }, { label: 'Rojo' }],
    },
    {
      name: 'Longitud',
      values: [{ label: '1 m' }, { label: '2 m', priceAdjustment: 5 }],
    },
    {
      name: 'Material',
      values: [{ label: 'Silicona' }, { label: 'Cuero' }, { label: 'Metal' }],
    },
  ],
};

async function seed() {
  await dataSource.initialize();

  const brandRepo = dataSource.getRepository(Brand);
  const categoryRepo = dataSource.getRepository(Category);
  const productRepo = dataSource.getRepository(Product);
  const productAttributeValuesRepo =
    dataSource.getRepository(ProductAttributeValue);
  const attributeDefinitionRepo =
    dataSource.getRepository(AttributeDefinition);
  const optionGroupRepo = dataSource.getRepository(OptionGroup);
  const optionValueRepo = dataSource.getRepository(OptionValue);

  await brandRepo.upsert(
    brands.map((brand) => ({
      ...brand,
      id: randomUUID(),
    })),
    ['slug'],
  );
  await categoryRepo.upsert(
    categories.map((category) => ({
      ...category,
      id: randomUUID(),
    })),
    ['slug'],
  );

  const categoriesInDb = await categoryRepo.find();
  const categoriesBySlug = new Map(
    categoriesInDb.map((category) => [category.slug, category]),
  );

  for (const [slug, definitions] of Object.entries(
    attributeDefinitionsByCategory,
  )) {
    const category = categoriesBySlug.get(slug);
    if (!category) continue;

    for (const definition of definitions) {
      const existing = await attributeDefinitionRepo.findOneBy({
        name: definition.name,
        categoryId: category.id,
      });

      if (existing) continue;

      const newDefinition = attributeDefinitionRepo.create({
        ...definition,
        categoryId: category.id,
      });
      await attributeDefinitionRepo.save(newDefinition);
    }
  }

  for (const [slug, groups] of Object.entries(optionGroupsByCategory)) {
    const category = categoriesBySlug.get(slug);
    if (!category) continue;

    for (const group of groups) {
      let optionGroup = await optionGroupRepo.findOneBy({
        name: group.name,
        categoryId: category.id,
      });

      if (!optionGroup) {
        optionGroup = optionGroupRepo.create({
          name: group.name,
          description: group.description,
          categoryId: category.id,
        });
        optionGroup = await optionGroupRepo.save(optionGroup);
      }

      for (const value of group.values) {
        const existingValue = await optionValueRepo.findOneBy({
          label: value.label,
          optionGroupId: optionGroup.id,
        });

        if (existingValue) continue;

        const optionValue = optionValueRepo.create({
          label: value.label,
          priceAdjustment: value.priceAdjustment ?? 0,
          optionGroupId: optionGroup.id,
        });
        await optionValueRepo.save(optionValue);
      }
    }
  }

  const telefonosPath = join(__dirname, '../../telefonos.json');
  try {
    const productsRaw = await readFile(telefonosPath, 'utf-8');
    const products = JSON.parse(productsRaw) as Array<{
      name: string;
      description: string;
      price: number;
      stock: number;
      categoryId: string;
      brandId: string;
      optionGroupIds?: string[];
      attributeValues?: Array<{
        attributeId: string;
        valueText?: string;
        valueNumber?: number;
        valueBoolean?: boolean;
      }>;
    }>;

    for (const productData of products) {
      const {
        optionGroupIds,
        attributeValues,
        ...productFields
      } = productData;

      const existingProduct = await productRepo.findOneBy({
        name: productFields.name,
        brandId: productFields.brandId,
        categoryId: productFields.categoryId,
      });

      const product = await productRepo.save(
        existingProduct
          ? productRepo.merge(existingProduct, productFields)
          : productRepo.create(productFields),
      );

      if (optionGroupIds?.length) {
        const optionGroups = await optionGroupRepo.findBy({
          id: In(optionGroupIds),
        });
        if (optionGroups.length !== optionGroupIds.length) {
          const foundIds = new Set(optionGroups.map((group) => group.id));
          const missingIds = optionGroupIds.filter((id) => !foundIds.has(id));
          throw new Error(
            `Option groups no encontrados: ${missingIds.join(', ')}`,
          );
        }

        await productRepo.save({ id: product.id, optionGroups });
      }

      if (attributeValues?.length) {
        const attributeIds = Array.from(
          new Set(attributeValues.map((value) => value.attributeId)),
        );
        const attributes = await attributeDefinitionRepo.findBy({
          id: In(attributeIds),
        });
        if (attributes.length !== attributeIds.length) {
          const foundIds = new Set(
            attributes.map((attribute) => attribute.id),
          );
          const missingIds = attributeIds.filter((id) => !foundIds.has(id));
          throw new Error(
            `Atributos no encontrados: ${missingIds.join(', ')}`,
          );
        }

        await productAttributeValuesRepo.delete({ productId: product.id });

        const valuesToSave = attributeValues.map((value) =>
          productAttributeValuesRepo.create({
            productId: product.id,
            attributeId: value.attributeId,
            valueText: value.valueText,
            valueNumber: value.valueNumber,
            valueBoolean: value.valueBoolean,
          }),
        );

        await productAttributeValuesRepo.save(valuesToSave);
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('No se pudo cargar el seed de telefonos.', error);
  }

  await dataSource.destroy();

  // eslint-disable-next-line no-console
  console.log(
    'Seed completado: marcas, categorias, atributos, opciones y productos.',
  );
}

seed().catch(async (error) => {
  // eslint-disable-next-line no-console
  console.error('Seed fallido', error);
  await dataSource.destroy();
  process.exit(1);
});
