import { renderHook, waitFor, act } from "@testing-library/react";
import { useApiResource } from "./useApiResource";

describe("useApiResource", () => {
  const mockData = { prs: 5, repos: 3 };
  const mockError = new Error("Network error");

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("returns initial loading state", async () => {
    const fetchFn = vi.fn(() => Promise.resolve(mockData));

    const { result } = renderHook(() => useApiResource(fetchFn));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.refetch).toBeDefined();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  test("sets data on successful fetch", async () => {
    const fetchFn = vi.fn(() => Promise.resolve(mockData));

    const { result } = renderHook(() => useApiResource(fetchFn));

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test("sets error on failed fetch", async () => {
    const fetchFn = vi.fn(() => Promise.reject(mockError));

    const { result } = renderHook(() => useApiResource(fetchFn));

    await waitFor(() => {
      expect(result.current.error).toEqual(mockError);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
  });

  test("refetch re-fetches and updates data", async () => {
    const fetchFn = vi.fn(() => Promise.resolve(mockData));

    const { result } = renderHook(() => useApiResource(fetchFn));

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
    });

    const updatedData = { prs: 10, repos: 5 };
    fetchFn.mockResolvedValueOnce(updatedData);

    act(() => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(updatedData);
    });
  });

  test("refetch handles failure", async () => {
    const fetchFn = vi.fn(() => Promise.resolve(mockData));

    const { result } = renderHook(() => useApiResource(fetchFn));

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
    });

    fetchFn.mockRejectedValueOnce(mockError);

    act(() => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.error).toEqual(mockError);
    });

    expect(result.current.loading).toBe(false);
  });
});
