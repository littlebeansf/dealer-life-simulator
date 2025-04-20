import { Flex, Text } from "@chakra-ui/react";
import { DealerState } from "@/types/game";

interface MonthProgressProps {
  dealerState: DealerState;
}

export default function MonthProgress({ dealerState }: MonthProgressProps) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <Flex align="center" justify="center" w="full" bg="brand.surface" p={2}>
      <Text fontSize="md" color="white">
        📅 {monthNames[dealerState.time.month]} {dealerState.time.year}
      </Text>
    </Flex>
  );
}
