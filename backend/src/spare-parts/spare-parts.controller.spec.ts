import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { SparePartsModule } from './spare-parts.module';

describe('SparePartsController (integration)', () => {
  let app: INestApplication;
  let mongo: MongoMemoryServer;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();

    const moduleRef = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(mongo.getUri()), SparePartsModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await mongo.stop();
  });

  const validPayload = {
    name: 'Pastillas de freno',
    brand: 'Yamaha',
    category: 'Frenos',
    reference: 'FR-2024',
    price: 45000,
    stock: 8,
  };

  it('POST /spare-parts creates a part with status "disponible" when stock > 5', async () => {
    const res = await request(app.getHttpServer())
      .post('/spare-parts')
      .send(validPayload)
      .expect(201);

    expect(res.body).toMatchObject({
      name: 'Pastillas de freno',
      stock: 8,
      status: 'disponible',
    });
    expect(res.body._id).toBeDefined();
  });

  it('POST /spare-parts assigns "bajo_stock" when stock is between 1 and 5', async () => {
    const res = await request(app.getHttpServer())
      .post('/spare-parts')
      .send({ ...validPayload, reference: 'FR-2025', stock: 3 })
      .expect(201);

    expect(res.body.status).toBe('bajo_stock');
  });

  it('POST /spare-parts assigns "agotado" when stock is 0', async () => {
    const res = await request(app.getHttpServer())
      .post('/spare-parts')
      .send({ ...validPayload, reference: 'FR-2026', stock: 0 })
      .expect(201);

    expect(res.body.status).toBe('agotado');
  });

  it('POST /spare-parts rejects payload without name', async () => {
    const invalid: Partial<typeof validPayload> = { ...validPayload };
    delete invalid.name;
    await request(app.getHttpServer())
      .post('/spare-parts')
      .send(invalid)
      .expect(400);
  });

  it('POST /spare-parts rejects negative price', async () => {
    await request(app.getHttpServer())
      .post('/spare-parts')
      .send({ ...validPayload, price: -10 })
      .expect(400);
  });

  it('GET /spare-parts returns all created parts', async () => {
    const res = await request(app.getHttpServer())
      .get('/spare-parts')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(3);
  });
});
