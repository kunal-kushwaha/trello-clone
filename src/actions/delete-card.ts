"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";

import { Card } from "@prisma/client";
import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";

const DeleteCard = z.object({
  id: z.string(),
});

type InputType = z.infer<typeof DeleteCard>;
type ReturnType = ActionState<InputType, Card>;

/**
 * Async handler function for deleting a card.
 *
 * Takes in a DeleteCard input type containing the card ID.
 * Checks for a logged in user and returns error if not found.
 * Tries to delete the card from the database.
 * Returns the deleted card data on success, error message on failure.
 * Also revalidates the /board path to refresh cached data.
 */
const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();

  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id } = data;
  let card;

  try {
    card = await db.card.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    return {
      error: "Failed to delete.",
    };
  }

  revalidatePath(`/board`);
  return { data: card };
};

export const deleteCard = createSafeAction(DeleteCard, handler);
