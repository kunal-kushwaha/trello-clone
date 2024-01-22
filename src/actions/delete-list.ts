"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";

import { List } from "@prisma/client";
import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";

const DeleteList = z.object({
  id: z.string(),
});

type InputType = z.infer<typeof DeleteList>;
type ReturnType = ActionState<InputType, List>;

/**
 * Deletes a list from the database.
 *
 * Authenticates the user with Clerk.
 * Gets the list ID and user ID from the input data.
 * Tries to delete the list from the database.
 * Returns the deleted list on success, or an error message on failure.
 * Revalidates the /board page to update cached data.
 */
const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();

  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id } = data;
  let list;

  try {
    list = await db.list.delete({
      where: {
        id,
        userId,
      },
    });
  } catch (error) {
    return {
      error: "Failed to delete.",
    };
  }

  revalidatePath(`/board`);
  return { data: list };
};

export const deleteList = createSafeAction(DeleteList, handler);
