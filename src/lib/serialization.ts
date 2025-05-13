// utils/serialization.ts
export function serializePrismaData<T>(data: T): any {
  if (data === null || data === undefined) {
    return data;
  }

  // Handle Date objects
  if (data instanceof Date) {
    return data.toISOString();
  }

  // Handle Decimal objects (from Prisma)
  if (
    data !== null &&
    typeof data === "object" &&
    "toFixed" in data &&
    typeof data.toFixed === "function" &&
    "toString" in data &&
    typeof data.toString === "function"
  ) {
    return data.toString();
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map((item) => serializePrismaData(item));
  }

  // Handle plain objects (including Prisma model instances)
  if (data !== null && typeof data === "object" && !Array.isArray(data)) {
    const result: Record<string, any> = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        result[key] = serializePrismaData((data as any)[key]);
      }
    }
    return result;
  }

  // Return primitives as is
  return data;
}
