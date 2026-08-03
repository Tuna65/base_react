export const mapToEntity = <T>(cls: any, dto: any): T => {
  if (!dto) return dto;
  if (Array.isArray(dto)) {
    return dto.map((item) => mapToEntity(cls, item)) as any;
  }
  if (typeof cls === "function") {
    try {
      const instance = new cls();
      return Object.assign(instance, dto);
    } catch {
      return { ...dto } as T;
    }
  }
  return { ...dto } as T;
};

export const mapToDto = <T>(cls: any, entity: any): T => {
  if (!entity) return entity;
  if (Array.isArray(entity)) {
    return entity.map((item) => mapToDto(cls, item)) as any;
  }
  if (typeof cls === "function") {
    try {
      const instance = new cls();
      return Object.assign(instance, entity);
    } catch {
      return { ...entity } as T;
    }
  }
  return { ...entity } as T;
};
