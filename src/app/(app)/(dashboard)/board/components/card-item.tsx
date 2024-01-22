"use client";

import { useCardModal } from "@/components/card-modal";
import { Draggable } from "@hello-pangea/dnd";
import { Card } from "@prisma/client";

interface CardItemProps {
  data: Card;
  index: number;
}

/**
 * Renders a draggable card item.
 *
 * @param data - The card data.
 * @param index - The index of the card for drag and drop ordering.
 */
export const CardItem = ({ data, index }: CardItemProps) => {
  const cardModal = useCardModal();

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          role="button"
          onClick={() => cardModal.onOpen(data.id)}
          className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-xl shadow-sm"
        >
          {data.title}
        </div>
      )}
    </Draggable>
  );
};
