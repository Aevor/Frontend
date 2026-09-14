import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient, setAuthToken, getAuthToken, clearAuthToken } from "./client";

function mockFetchOnce({ ok = true, status = 200, body = "" }) {
  global.fetch = vi.fn().mockResolvedValue({
    ok,
    status,
    text: () => Promise.resolve(body),
  });
}

describe("apiClient", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns parsed JSON on a successful response", async () => {
    mockFetchOnce({ body: JSON.stringify({ id: "1" }) });
    const result = await apiClient.get("/thing");
    expect(result).toEqual({ id: "1" });
  });

  it("sends no Authorization header when there's no token", async () => {
    mockFetchOnce({ body: "{}" });
    await apiClient.get("/thing");
    const [, options] = global.fetch.mock.calls[0];
    expect(options.headers.Authorization).toBeUndefined();
  });

  it("attaches a Bearer header once a token is stored", async () => {
    setAuthToken("test-token-123");
    mockFetchOnce({ body: "{}" });
    await apiClient.get("/thing");
    const [, options] = global.fetch.mock.calls[0];
    expect(options.headers.Authorization).toBe("Bearer test-token-123");
  });

  it("always sends credentials: include, regardless of auth state", async () => {
    mockFetchOnce({ body: "{}" });
    await apiClient.get("/thing");
    const [, options] = global.fetch.mock.calls[0];
    expect(options.credentials).toBe("include");
  });

  it("throws ApiError with status and message on a non-ok response", async () => {
    mockFetchOnce({ ok: false, status: 404, body: JSON.stringify({ message: "Not found" }) });
    await expect(apiClient.get("/thing")).rejects.toMatchObject({
      name: "ApiError",
      status: 404,
      message: "Not found",
    });
  });

  it("falls back to a generic message when the error body has none", async () => {
    mockFetchOnce({ ok: false, status: 500, body: "" });
    await expect(apiClient.get("/thing")).rejects.toMatchObject({
      status: 500,
      message: "Request failed with status 500",
    });
  });

  it("throws a network ApiError when fetch itself rejects", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network down"));
    await expect(apiClient.get("/thing")).rejects.toMatchObject({
      name: "ApiError",
      status: 0,
    });
  });

  it("clearAuthToken actually removes the stored token", () => {
    setAuthToken("something");
    clearAuthToken();
    expect(getAuthToken()).toBeNull();
  });
});
