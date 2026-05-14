import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { dirname, resolve } from 'path';
import type { StoreData } from '../common/types';
import { createSeedData } from './seed';

@Injectable()
export class DataStoreService implements OnModuleInit {
  private filePath!: string;
  private cache!: StoreData;
  private writeQueue = Promise.resolve();

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.filePath = resolve(
      process.cwd(),
      this.configService.get<string>('DATA_FILE') || 'data/store.json',
    );

    await mkdir(dirname(this.filePath), { recursive: true });
    await this.ensureLoaded();
  }

  async getData() {
    await this.ensureLoaded();
    return structuredClone(this.cache);
  }

  async update(mutator: (current: StoreData) => StoreData | void) {
    await this.ensureLoaded();
    const draft = structuredClone(this.cache);
    const result = mutator(draft);
    this.cache = result ? result : draft;

    this.writeQueue = this.writeQueue.then(() =>
      writeFile(this.filePath, JSON.stringify(this.cache, null, 2), 'utf8'),
    );
    await this.writeQueue;
    return structuredClone(this.cache);
  }

  private async ensureLoaded() {
    if (this.cache) {
      return;
    }

    try {
      const raw = await readFile(this.filePath, 'utf8');
      this.cache = JSON.parse(raw) as StoreData;
    } catch {
      this.cache = createSeedData(process.env);
      await writeFile(this.filePath, JSON.stringify(this.cache, null, 2), 'utf8');
    }
  }
}
