import { stackRepo, type Stack, type Card } from './data.js';

// API response types
export interface StackResponse {
  id: number;
  name: string;
  cover: { type: string; value: string };
  cardCount?: number;
  createdAt: string;
}

export interface StackWithCardsResponse extends StackResponse {
  cards: {
    id: number;
    stackId: number;
    name: string;
    cover: string;
    description: string | null;
    createdAt: string;
  }[];
}

// Transform DB stack to API response
const toResponse = (stack: Stack & { cardCount?: number }): StackResponse => ({
  id: stack.id,
  name: stack.name,
  cover: { type: stack.cover_type, value: stack.cover_value },
  ...(stack.cardCount !== undefined && { cardCount: stack.cardCount }),
  createdAt: stack.created_at,
});

const toResponseWithCards = (stack: Stack & { cards: Card[] }): StackWithCardsResponse => ({
  id: stack.id,
  name: stack.name,
  cover: { type: stack.cover_type, value: stack.cover_value },
  cards: stack.cards.map((card) => ({
    id: card.id,
    stackId: card.stack_id,
    name: card.name,
    cover: card.cover,
    description: card.description,
    createdAt: card.created_at,
  })),
  createdAt: stack.created_at,
});

export const stackService = {
  getAll(): StackResponse[] {
    return stackRepo.findAll().map(toResponse);
  },

  find(query: { name?: string; limit?: number; offset?: number }): StackResponse[] {
    return stackRepo.find(query).map(toResponse);
  },

  getById(id: number): StackWithCardsResponse | null {
    const stack = stackRepo.findByIdWithCards(id);
    return stack ? toResponseWithCards(stack) : null;
  },

  create(data: {
    name: string;
    cover?: { type: string; value: string };
  }): StackResponse {
    const stack = stackRepo.create({
      name: data.name,
      cover: data.cover as { type: Stack['cover_type']; value: string },
    });
    return toResponse(stack);
  },

  update(
    id: number,
    data: { name?: string; cover?: { type: string; value: string } },
  ): StackResponse | { error: string } {
    const stack = stackRepo.update(id, {
      name: data.name,
      cover: data.cover as { type: Stack['cover_type']; value: string },
    });
    if (!stack) return { error: 'Stack not found' };
    return toResponse(stack);
  },

  delete(id: number): { message: string } | { error: string } {
    const deleted = stackRepo.delete(id);
    if (!deleted) return { error: 'Stack not found' };
    return { message: 'Stack deleted successfully' };
  },
};

