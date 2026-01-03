// ============================================
import React, { createContext, useContext, useRef, useState } from "react";
import { Animated, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const MENU_WIDTH = width * 0.8;

interface MenuContextType {
  open: boolean;
  toggleMenu: () => void;
  translateX: Animated.Value;
  overlayOpacity: Animated.Value;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const translateX = useRef(new Animated.Value(-MENU_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    const toValue = open ? -MENU_WIDTH : 0;
    const opacityValue = open ? 0 : 1;

    Animated.parallel([
      Animated.spring(translateX, {
        toValue,
        useNativeDriver: true,
        tension: 80,
        friction: 12,
      }),
      Animated.timing(overlayOpacity, {
        toValue: opacityValue,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setOpen(!open);
  };

  return (
    <MenuContext.Provider
      value={{ open, toggleMenu, translateX, overlayOpacity }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within MenuProvider");
  }
  return context;
}
