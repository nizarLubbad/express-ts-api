export class Repository<
  T extends { id: string; createdAt: Date; updatedAt: Date }
> {
  private data: T[] = [];

  findAll(): T[] {
    return this.data;
  }

  findById(id: string): T | undefined {
    return this.data.find((item) => item.id === id);
  }

  findOne(predicate: (item: T) => boolean): T | undefined {
    return this.data.find(predicate);
  }

  create(item: Omit<T, "id" | "createdAt" | "updatedAt">): T {
    const newItem = {
      ...item,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as T;

    this.data.push(newItem);
    return newItem;
  }

  update(
    id: string,
    updates: Partial<Omit<T, "id" | "createdAt">>
  ): T | undefined {
    const itemIndex = this.data.findIndex((item) => item.id === id);
    if (itemIndex === -1) return undefined;

    const updatedItem = {
      ...this.data[itemIndex],
      ...updates,
      updatedAt: new Date(),
    } as T;

    this.data[itemIndex] = updatedItem;
    return updatedItem;
  }

  delete(id: string): boolean {
    const itemIndex = this.data.findIndex((item) => item.id === id);
    if (itemIndex === -1) return false;

    this.data.splice(itemIndex, 1);
    return true;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}
