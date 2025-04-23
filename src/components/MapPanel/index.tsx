import { Box, Flex, Image, Text, Button, useToast } from "@chakra-ui/react";
import { locations } from "@/data/locations";
import { DealerState } from "@/types/game";
import { Generic } from "@/data/generic";

interface MapPanelProps {
  dealerState: DealerState;
}

export default function MapPanel({ dealerState }: MapPanelProps) {
  const toast = useToast();

  const handleTravel = (locationName: string) => {
    toast({
      title: `Traveling to ${locationName}...`,
      status: "info",
      duration: 2000,
      isClosable: true,
      position: "top-left",
      variant: "subtle",
    });
    console.log("Travel to", locationName);
  };

  return (
    <Flex direction="column" align="center" justify="center" w="full" h="full">
      {/* World Map Image */}
      <Box
        w="full"
        h="full"
        position="relative"
        overflow="hidden"
        borderRadius="lg"
      >
        <Image
          src={Generic.background.Map}
          alt="World Map"
          w="100%"
          h="100%"
          objectFit="cover"
          draggable={false}
        />

        {/* Location Buttons */}
        {locations.map((location) => (
          <Button
            key={location.id}
            position="absolute"
            top={`${location.y}%`}
            left={`${location.x}%`}
            transform="translate(-50%, -50%)"
            size="xs"
            bg="blackAlpha.700"
            color="white"
            _hover={{ bg: "purple.600" }}
            fontSize="xs"
            onClick={() => handleTravel(location.name)}
          >
            {location.name}
          </Button>
        ))}
      </Box>
    </Flex>
  );
}
