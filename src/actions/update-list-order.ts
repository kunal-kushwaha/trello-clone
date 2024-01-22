"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";

import { List } from "@prisma/client";
import { z } from "zod";

import { ActionState, createSafeAction } from "@/lib/create-safe-action";

const UpdateListOrder = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      order: z.number(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
  ),
});

type InputType = z.infer<typeof UpdateListOrder>;
type ReturnType = ActionState<InputType, List[]>;

/**
 * Handler function to update the order of lists.
 *
 * Takes in InputType which contains an array of list items with id, title, order etc.
 * Gets the current user's id from the auth module.
 * Maps over the list items to create an update transaction for each one with the new order.
 * Runs the transaction to update the lists in the database.
 * Revalidates the board page cache.
 * Returns the updated lists in the response.
 * Handles any errors by returning a "Failed to reorder" error response.
 */
const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();

  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  const { items } = data;
  let lists;

  try {
    const transaction = items.map((list) =>
      db.list.update({
        where: {
          id: list.id,
          userId,
        },
        data: {
          order: list.order,
        },
      })
    );

    lists = await db.$transaction(transaction);
  } catch (error) {
    return {
      error: "Failed to reorder.",
    };
  }

  revalidatePath(`/board`);
  return { data: lists };
};

export const updateListOrder = createSafeAction(UpdateListOrder, handler);
