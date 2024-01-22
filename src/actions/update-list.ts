"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";

import { z } from "zod";

import { List } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";

const UpdateList = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title is required",
    })
    .min(3, {
      message: "Title is too short",
    }),
  id: z.string(),
});

type InputType = z.infer<typeof UpdateList>;
type ReturnType = ActionState<InputType, List>;

/**
 * Handler function to update a list.
 *
 * Takes in input data validated by the UpdateList schema.
 * Gets the current user's ID from Clerk auth.
 * Updates the list in the database with the new title if the ID matches the user.
 * Returns the updated list data on success, or an error if update failed.
 * Also revalidates the /board path to refresh cached data.
 */
const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();

  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title, id } = data;
  let list;

  try {
    list = await db.list.update({
      where: {
        id,
        userId,
      },
      data: {
        title,
      },
    });
  } catch (error) {
    return {
      error: "Failed to update.",
    };
  }

  revalidatePath(`/board`);
  return { data: list };
};

export const updateList = createSafeAction(UpdateList, handler);
