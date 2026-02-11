import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getIdeaBoxItems,
  addIdeaBoxItem,
  removeIdeaBoxItem,
  type IdeaBoxItemRow,
} from '../services/ideaBoxService';

export function useIdeaBox() {
  const { user } = useAuth();
  const [items, setItems] = useState<IdeaBoxItemRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      setItems([]);
      return;
    }

    setIsLoading(true);
    getIdeaBoxItems(user.id)
      .then(setItems)
      .finally(() => setIsLoading(false));
  }, [user?.id]);

  const addItem = useCallback(
    async (item: {
      type: string;
      title: string;
      content: string;
      preview?: string;
      toolId?: string;
      tags?: string[];
    }) => {
      if (!user?.id) return;

      const id = `idea-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      const success = await addIdeaBoxItem({
        id,
        userId: user.id,
        ...item,
      });

      if (success) {
        // Optimistically add to local state
        setItems((prev) => [
          {
            id,
            user_id: user.id,
            type: item.type,
            title: item.title,
            content: item.content,
            preview: item.preview ?? null,
            tool_id: item.toolId ?? null,
            tags: item.tags ?? null,
            created_at: new Date().toISOString(),
          },
          ...prev,
        ]);
      }
    },
    [user?.id],
  );

  const removeItem = useCallback(async (itemId: string) => {
    const success = await removeIdeaBoxItem(itemId);
    if (success) {
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    }
  }, []);

  return { items, addItem, removeItem, isLoading };
}
