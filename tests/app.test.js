const request = require("supertest");

jest.mock("nanoid", () => ({
  nanoid: jest.fn(() => "abc1234"),
}));

jest.mock("../src/models/Url", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
  findOneAndUpdate: jest.fn(),
  findOneAndDelete: jest.fn(),
  exists: jest.fn(),
}));

jest.mock("../src/utils/generateQrCode", () => jest.fn(async (shortUrl) => `data:image/png;base64,${Buffer.from(shortUrl).toString("base64")}`));

const Url = require("../src/models/Url");
const { createApp } = require("../src/app");

function makeUrlDoc(overrides = {}) {
  return {
    _id: "6654b7d11c4f0a1234567890",
    originalUrl: "https://openai.com",
    normalizedUrl: "https://openai.com/",
    shortCode: "openai",
    clicks: 0,
    lastVisitedAt: null,
    createdAt: new Date("2026-05-28T00:00:00.000Z"),
    updatedAt: new Date("2026-05-28T00:00:00.000Z"),
    save: jest.fn().mockResolvedValue(true),
    ...overrides,
  };
}

describe("SnapLink API", () => {
  const app = createApp();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET /api/health returns server health", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body).toHaveProperty("timestamp");
  });

  test("POST /api/urls creates a short link with QR metadata", async () => {
    Url.findOne.mockResolvedValueOnce(null);
    Url.exists.mockResolvedValueOnce(false);
    Url.create.mockResolvedValueOnce(makeUrlDoc());

    const response = await request(app).post("/api/urls").send({
      originalUrl: "https://openai.com",
      customCode: "openai",
    });

    expect(response.status).toBe(201);
    expect(response.body.data.shortCode).toBe("openai");
    expect(response.body.data.shortUrl).toMatch(/openai$/);
    expect(response.body.data.qrCodeDataUrl).toContain("data:image/png;base64,");
  });

  test("GET /api/urls lists recent links", async () => {
    const sort = jest.fn().mockReturnThis();
    const limit = jest.fn().mockResolvedValue([makeUrlDoc()]);
    Url.find.mockReturnValue({ sort, limit });

    const response = await request(app).get("/api/urls");

    expect(response.status).toBe(200);
    expect(response.body.count).toBe(1);
    expect(response.body.data[0].shortCode).toBe("openai");
  });

  test("PATCH /api/urls/:shortCode updates the destination URL", async () => {
    Url.findOneAndUpdate.mockResolvedValueOnce(
      makeUrlDoc({
        originalUrl: "https://platform.openai.com",
        normalizedUrl: "https://platform.openai.com/",
      })
    );

    const response = await request(app).patch("/api/urls/openai").send({
      originalUrl: "https://platform.openai.com",
    });

    expect(response.status).toBe(200);
    expect(response.body.data.originalUrl).toBe("https://platform.openai.com");
  });

  test("GET /:shortCode redirects and updates click count", async () => {
    const urlDoc = makeUrlDoc({ clicks: 2 });
    Url.findOne.mockResolvedValueOnce(urlDoc);

    const response = await request(app).get("/openai");

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("https://openai.com/");
    expect(urlDoc.clicks).toBe(3);
    expect(urlDoc.save).toHaveBeenCalled();
  });
});
