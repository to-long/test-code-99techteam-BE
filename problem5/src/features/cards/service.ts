import { cardRepo, type Card } from './data.js';
import { stackRepo } from '../stacks/data.js';

// API response type
export interface CardResponse {
  id: number;
  stackId: number;
  name: string;
  cover: string;
  description: string | null;
  createdAt: string;
}

// Transform DB card to API response
const toResponse = (card: Card): CardResponse => ({
  id: card.id,
  stackId: card.stack_id,
  name: card.name,
  cover: card.cover,
  description: card.description,
  createdAt: card.created_at,
});

export const cardService = {
  getAll(): CardResponse[] {
    return cardRepo.findAll().map(toResponse);
  },

  find(query: { name?: string; stackId?: number; limit?: number; offset?: number }): CardResponse[] {
    return cardRepo.find(query).map(toResponse);
  },

  getById(id: number): CardResponse | null {
    const card = cardRepo.findById(id);
    return card ? toResponse(card) : null;
  },

  getByStackId(stackId: number): { cards: CardResponse[] } | { error: string } {
    const stack = stackRepo.findById(stackId);
    if (!stack) return { error: 'Stack not found' };

    return { cards: cardRepo.findByStackId(stackId).map(toResponse) };
  },

  create(
    stackId: number,
    data: { name: string; cover: string; description?: string },
  ): CardResponse | { error: string } {
    const stack = stackRepo.findById(stackId);
    if (!stack) return { error: 'Stack not found' };

    const card = cardRepo.create({
      stackId,
      name: data.name,
      cover: data.cover,
      description: data.description,
    });

    return toResponse(card);
  },

  update(
    id: number,
    data: { name?: string; cover?: string; description?: string; stackId?: number },
  ): CardResponse | { error: string } {
    // Validate target stack if moving
    if (data.stackId !== undefined) {
      const targetStack = stackRepo.findById(data.stackId);
      if (!targetStack) return { error: 'Target stack not found' };
    }

    const card = cardRepo.update(id, data);
    if (!card) return { error: 'Card not found' };

    return toResponse(card);
  },

  delete(id: number): { message: string } | { error: string } {
    const deleted = cardRepo.delete(id);
    if (!deleted) return { error: 'Card not found' };

    return { message: 'Card deleted successfully' };
  },

  move(id: number, stackId: number): CardResponse | { error: string } {
    const targetStack = stackRepo.findById(stackId);
    if (!targetStack) return { error: 'Target stack not found' };

    const card = cardRepo.move(id, stackId);
    if (!card) return { error: 'Card not found' };

    return toResponse(card);
  },
};

