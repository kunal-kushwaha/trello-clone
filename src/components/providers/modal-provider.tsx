"use client";

import { useEffect, useState } from "react";

import { CardModal } from "@/components/card-modal";

/**
 * ModalProvider component that conditionally renders the CardModal component.
 * Uses isMounted state to prevent rendering CardModal on initial mount.
 */
export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CardModal />
    </>
  );
};
