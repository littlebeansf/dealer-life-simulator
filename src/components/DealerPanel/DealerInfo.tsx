import { Text } from "@chakra-ui/react";
import { DealerState } from "@/types/game";

interface DealerInfoProps {
  dealerState: DealerState;
}

export default function DealerInfo({ dealerState }: DealerInfoProps) {
  const monthNumber = (dealerState.time.month % 12) + 1;

  return (
    <>
      <Text
        fontSize="2xl"
        fontWeight="bold"
        color="brand.text"
        textAlign="center"
      >
        {dealerState.name}
      </Text>

      <Text fontSize="sm" color="brand.text" textAlign="center">
        Age {dealerState.time.age} ({monthNumber}) - {dealerState.gender}
      </Text>
    </>
  );
}
