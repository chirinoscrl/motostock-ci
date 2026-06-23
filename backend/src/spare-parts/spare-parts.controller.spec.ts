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
    expect(res.body.id).toBeDefined();
    expect(typeof res.body.id).toBe('string');
    expect(res.body._id).toBeUndefined();
    expect(res.body.__v).toBeUndefined();
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

  it('GET /spare-parts?status=agotado filters by status', async () => {
    const res = await request(app.getHttpServer())
      .get('/spare-parts?status=agotado')
      .expect(200);

    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body.every((p: { status: string }) => p.status === 'agotado')).toBe(
      true,
    );
  });

  it('GET /spare-parts?search= matches name, brand or category (case-insensitive)', async () => {
    const res = await request(app.getHttpServer())
      .get('/spare-parts?search=yamaha')
      .expect(200);

    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(
      res.body.every((p: { brand: string }) => p.brand === 'Yamaha'),
    ).toBe(true);
  });

  it('GET /spare-parts?status=invalido rejects unknown status', async () => {
    await request(app.getHttpServer())
      .get('/spare-parts?status=invalido')
      .expect(400);
  });

  it('GET /spare-parts/:id returns a single part', async () => {
    const created = await request(app.getHttpServer())
      .post('/spare-parts')
      .send({ ...validPayload, reference: 'FR-3001' })
      .expect(201);

    const res = await request(app.getHttpServer())
      .get(`/spare-parts/${created.body.id}`)
      .expect(200);

    expect(res.body.id).toBe(created.body.id);
    expect(res.body.reference).toBe('FR-3001');
  });

  it('GET /spare-parts/:id returns 404 for a missing part', async () => {
    await request(app.getHttpServer())
      .get('/spare-parts/64b0c0c0c0c0c0c0c0c0c0c0')
      .expect(404);
  });

  it('GET /spare-parts/:id returns 404 for an invalid id', async () => {
    await request(app.getHttpServer())
      .get('/spare-parts/not-an-id')
      .expect(404);
  });

  it('PATCH /spare-parts/:id recalculates status when stock changes', async () => {
    const created = await request(app.getHttpServer())
      .post('/spare-parts')
      .send({ ...validPayload, reference: 'FR-3002', stock: 20 })
      .expect(201);
    expect(created.body.status).toBe('disponible');

    const res = await request(app.getHttpServer())
      .patch(`/spare-parts/${created.body.id}`)
      .send({ stock: 0 })
      .expect(200);

    expect(res.body.stock).toBe(0);
    expect(res.body.status).toBe('agotado');
  });

  it('PATCH /spare-parts/:id updates a field without touching status', async () => {
    const created = await request(app.getHttpServer())
      .post('/spare-parts')
      .send({ ...validPayload, reference: 'FR-3003', stock: 10 })
      .expect(201);

    const res = await request(app.getHttpServer())
      .patch(`/spare-parts/${created.body.id}`)
      .send({ price: 99000 })
      .expect(200);

    expect(res.body.price).toBe(99000);
    expect(res.body.status).toBe('disponible');
  });

  it('PATCH /spare-parts/:id returns 404 for a missing part', async () => {
    await request(app.getHttpServer())
      .patch('/spare-parts/64b0c0c0c0c0c0c0c0c0c0c0')
      .send({ price: 1 })
      .expect(404);
  });

  it('DELETE /spare-parts/:id removes a part and returns 204', async () => {
    const created = await request(app.getHttpServer())
      .post('/spare-parts')
      .send({ ...validPayload, reference: 'FR-3004' })
      .expect(201);

    await request(app.getHttpServer())
      .delete(`/spare-parts/${created.body.id}`)
      .expect(204);

    await request(app.getHttpServer())
      .get(`/spare-parts/${created.body.id}`)
      .expect(404);
  });

  it('DELETE /spare-parts/:id returns 404 for a missing part', async () => {
    await request(app.getHttpServer())
      .delete('/spare-parts/64b0c0c0c0c0c0c0c0c0c0c0')
      .expect(404);
  });
});
