import { Flex, Text, useColorModeValue } from "@chakra-ui/react";
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

  const bg = useColorModeValue("lightbrand.surface", "brand.surface");
  const color = useColorModeValue("lightbrand.text", "brand.text");

  return (
    <Flex align="center" justify="center" w="full" bg={bg} p={2}>
      <Text fontSize="md" color={color}>
        📅 {monthNames[dealerState.time.month]} {dealerState.time.year}
      </Text>
    </Flex>
  );
}
