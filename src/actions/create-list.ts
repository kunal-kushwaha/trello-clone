"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";

import { List } from "@prisma/client";
import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";

const CreateList = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title is required",
    })
    .min(3, {
      message: "Title is too short",
    }),
});

type InputType = z.infer<typeof CreateList>;
type ReturnType = ActionState<InputType, List>;

/**
 * Handler function to create a new list.
 *
 * Takes in InputType which is validated input data.
 * Returns a promise resolving to ReturnType which is the action state containing the created list or an error.
 *
 * Gets the current user's ID from Clerk auth.
 * Finds the last created list to increment the order.
 * Creates the new list in the DB including the incremented order.
 * Returns the created list data on success, error message on failure.
 * Revalidates the board page cache after creating.
 */
const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();

  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title } = data;
  let list;

  try {
    const lastList = await db.list.findFirst({
      where: { userId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastList ? lastList.order + 1 : 1;

    list = await db.list.create({
      data: {
        title,
        userId,
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
  return { data: list };
};

export const createList = createSafeAction(CreateList, handler);
