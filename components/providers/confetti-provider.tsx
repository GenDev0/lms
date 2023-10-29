"use client";

import { useConfettiStore } from "@/hooks/use-confetti-store";

import ReactConfetti from "react-confetti";

interface ConfettiProviderProps {}

const ConfettiProvider = (props: ConfettiProviderProps) => {
  const { isOpen, onClose } = useConfettiStore();

  if (!isOpen) {
    return null;
  }

  return (
    <ReactConfetti
      className='pointer-events-none z-[100]'
      numberOfPieces={5000}
      recycle={false}
      onConfettiComplete={() => {
        onClose();
      }}
    />
  );
};
export default ConfettiProvider;
