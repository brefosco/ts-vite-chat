import { Button, useColorMode } from "@chakra-ui/react";
import { MdDarkMode, MdLightMode } from "react-icons/md";

function ToggleMode() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button onClick={toggleColorMode}>
      {colorMode === "light" ? <MdDarkMode /> : <MdLightMode />}
    </Button>
  );
}
export default ToggleMode;
