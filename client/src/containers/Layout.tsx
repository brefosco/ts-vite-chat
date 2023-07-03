import { BoxProps, Flex } from "@chakra-ui/react";

interface LayoutProps extends BoxProps {
  children: React.ReactNode;
}

function Layout({ children, ...rest }: LayoutProps) {
  return (
    <Flex h="100vh" flexDirection="column" {...rest}>
      {children}
    </Flex>
  );
}

export default Layout;
