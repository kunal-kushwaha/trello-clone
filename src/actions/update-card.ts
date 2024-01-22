"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";

import { Card } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";

import { z } from "zod";

const UpdateCard = z.object({
  description: z.optional(
    z
      .string({
        required_error: "Description is required",
        invalid_type_error: "Description is required",
      })
      .min(3, {
        message: "Description is too short.",
      })
  ),
  title: z.optional(
    z
      .string({
        required_error: "Title is required",
        invalid_type_error: "Title is required",
      })
      .min(3, {
        message: "Title is too short",
      })
  ),
  id: z.string(),
});

type InputType = z.infer<typeof UpdateCard>;
type ReturnType = ActionState<InputType, Card>;

/**
 * Handler function for the updateCard action.
 *
 * Takes in the input data, gets the user ID from Clerk auth,
 * validates the user can update the card, updates the card in the DB,
 * and returns the updated card data or an error.
 *
 * Also revalidates the /board page to show updated data.
 */
const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();

  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, ...values } = data;
  let card;

  try {
    card = await db.card.update({
      where: {
        id,
        list: {
          userId,
        },
      },
      data: {
        ...values,
      },
    });
  } catch (error) {
    return {
      error: "Failed to update.",
    };
  }

  revalidatePath(`/board`);
  return { data: card };
};

export const updateCard = createSafeAction(UpdateCard, handler);
