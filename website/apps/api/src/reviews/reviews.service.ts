import { Injectable, NotFoundException } from '@nestjs/common';
import { DataStoreService } from '../data/data-store.service';
import { UpdateReviewDto } from '../common/dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly dataStore: DataStoreService) {}

  async findAll() {
    const data = await this.dataStore.getData();
    return data.reviews;
  }

  async update(id: string, body: UpdateReviewDto) {
    let updated;
    await this.dataStore.update((draft) => {
      const review = draft.reviews.find((entry) => entry.id === id);
      if (!review) {
        throw new NotFoundException('Review not found');
      }
      review.status = body.status;
      updated = { ...review };
    });
    return updated;
  }

  async remove(id: string) {
    await this.dataStore.update((draft) => {
      const before = draft.reviews.length;
      draft.reviews = draft.reviews.filter((entry) => entry.id !== id);
      if (draft.reviews.length === before) {
        throw new NotFoundException('Review not found');
      }
    });
    return { success: true };
  }
}
