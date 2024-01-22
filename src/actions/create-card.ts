"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";

import { Card } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";

import { z } from "zod";

const CreateCard = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title is required",
    })
    .min(3, {
      message: "Title is too short",
    }),
  listId: z.string(),
});

type InputType = z.infer<typeof CreateCard>;
type ReturnType = ActionState<InputType, Card>;

/**
 * Creates a new card in the database.
 *
 * Authenticates the user. Validates the input data.
 * Finds the list to add the card to.
 * Gets the order number for the new card.
 * Creates the card in the database.
 * Handles any errors.
 * Revalidates the board page.
 * Returns the created card or any errors.
 */
const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();

  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title, listId } = data;
  let card;

  try {
    const list = await db.list.findUnique({
      where: {
        id: listId,
        userId,
      },
    });

    if (!list) {
      return {
        error: "List not found",
      };
    }

    const lastCard = await db.card.findFirst({
      where: { listId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastCard ? lastCard.order + 1 : 1;

    card = await db.card.create({
      data: {
        title,
        listId,
        order: newOrder,
      },
    });
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to create.",
    };
  }

  revalidatePath(`/board`);
  return { data: card };
};

export const createCard = createSafeAction(CreateCard, handler);
