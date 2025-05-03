import { Box, Flex, Image, Text, useToast, Tooltip } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { locations } from "@/data/locations";
import { DealerState } from "@/types/game";
import { Generic } from "@/data/generic";
import { icons } from "@/data/icons";

interface MapPanelProps {
  dealerState: DealerState;
  setDealerState: React.Dispatch<React.SetStateAction<DealerState | null>>;
}

export default function MapPanel({
  dealerState,
  setDealerState,
}: MapPanelProps) {
  const toast = useToast();
  const animationKeyRef = useRef(0);

  const [isTraveling, setIsTraveling] = useState(false);
  const [walkerCoords, setWalkerCoords] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [duration, setDuration] = useState(1300);

  // Set initial character position
  useEffect(() => {
    const currentLoc = locations.find((l) => l.id === dealerState.location);
    if (currentLoc) {
      setWalkerCoords({ x: currentLoc.x, y: currentLoc.y });
      animationKeyRef.current += 1;
    }
  }, [dealerState.location]);

  const handleTravel = (targetId: string) => {
    if (isTraveling || dealerState.location === targetId) return;

    const from = locations.find((l) => l.id === dealerState.location);
    const to = locations.find((l) => l.id === targetId);
    if (!from || !to) return;

    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const travelDuration = Math.max(1000, distance * 25);
    const travelCost = Math.floor(distance * 1.8);

    if (dealerState.stats.gold < travelCost) {
      toast({
        title: "Not enough gold to travel.",
        description: `Travel costs ${travelCost}$`,
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    setDuration(travelDuration);
    setIsTraveling(true);
    setWalkerCoords({ x: from.x, y: from.y });

    requestAnimationFrame(() => {
      setWalkerCoords({ x: to.x, y: to.y });

      setTimeout(() => {
        const date = `${
          [
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
          ][dealerState.time.month]
        } ${dealerState.time.year}`;
        setDealerState((prev) =>
          prev
            ? {
                ...prev,
                location: to.id,
                stats: {
                  ...prev.stats,
                  gold: prev.stats.gold - travelCost,
                },
                journal: [
                  ...prev.journal,
                  {
                    date,
                    text: `Traveled from ${from.name} to ${to.name} (-${travelCost}$)`,
                  },
                ],
              }
            : prev
        );

        setIsTraveling(false);

        toast({
          title: `Arrived at ${to.name}`,
          description: `Travel cost: ${travelCost}$`,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
          variant: "subtle",
        });
      }, travelDuration);
    });
  };

  return (
    <Flex direction="column" align="center" justify="center" w="full" h="full">
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

        {/* Dealer Icon */}
        {walkerCoords && (
          <Box
            key={`walker-${animationKeyRef.current}`}
            position="absolute"
            top={`calc(${walkerCoords.y}% - 3%)`}
            left={`${walkerCoords.x}%`}
            transform="translate(-50%, -100%)"
            style={{
              transition: `top ${duration}ms linear, left ${duration}ms linear`,
            }}
            zIndex={20}
            w="46px"
            h="46px"
            animation={!isTraveling ? "float 2s ease-in-out infinite" : "none"}
          >
            <Image
              src={icons.navigation.Traveling}
              alt="Dealer Icon"
              w="100%"
              h="100%"
              objectFit="contain"
              draggable={false}
            />
          </Box>
        )}

        {/* Location Markers */}
        {locations.map((location) => {
          const from = locations.find((l) => l.id === dealerState.location);
          const dx = from ? location.x - from.x : 0;
          const dy = from ? location.y - from.y : 0;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const cost = Math.floor(dist * 1.8);

          return (
            <Box
              key={location.id}
              position="absolute"
              top={`${location.y}%`}
              left={`${location.x}%`}
              transform="translate(-50%, -50%)"
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={1}
              zIndex={10}
            >
              <Tooltip
                label={`Travel cost: ${cost}$`}
                placement="bottom"
                hasArrow
                bg="gray.700"
                color="white"
                fontSize="xs"
              >
                <Box
                  as="button"
                  w="12px"
                  h="12px"
                  borderRadius="full"
                  bg="white"
                  border="2px solid black"
                  cursor="pointer"
                  _hover={{ bg: "purple.400" }}
                  onClick={() => handleTravel(location.id)}
                />
              </Tooltip>
              <Text
                fontSize="xs"
                color="white"
                bg="blackAlpha.600"
                px={1}
                borderRadius="sm"
                textAlign="center"
                pointerEvents="none"
              >
                {location.name}
              </Text>
            </Box>
          );
        })}
      </Box>

      <style>{`
        @keyframes float {
          0%   { transform: translate(-50%, -100%) translateY(0); }
          50%  { transform: translate(-50%, -100%) translateY(-4px); }
          100% { transform: translate(-50%, -100%) translateY(0); }
        }
      `}</style>
    </Flex>
  );
}
