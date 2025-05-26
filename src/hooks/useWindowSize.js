import { useWindowSize as useSize } from "@react-hook/window-size";

export function useWindowSize() {
  const [width, height] = useSize();
  return [width, height];
}
