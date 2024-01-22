import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

/**
 * GET handler for /api/cards/[cardId] route.
 *
 * Authenticates the user and finds a card by ID, including the list title.
 * Returns 401 if unauthenticated, 500 on error, or 200 with the card data.
 */
export async function GET(
  req: Request,
  { params }: { params: { cardId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const card = await db.card.findUnique({
      where: {
        id: params.cardId,
        list: {
          userId,
        },
      },
      include: {
        list: {
          select: {
            title: true,
          },
        },
      },
    });

    return NextResponse.json(card);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
