import {
  Wrench,
  Zap,
  Hammer,
  Paintbrush,
  Sparkles,
  Settings,
  Scissors,
  HardHat,
  Flame,
  Car,
  Leaf,
  Monitor,
  Smile,
  BookOpen,
  Camera,
  Star,
  type LucideIcon,
} from 'lucide-react';

// Maps category icon strings (from Firestore seed data) to Lucide icon components.
// Keys are lowercase string names matching the `icon` field in the Category type.
// No emoji keys — all icons are resolved via string names only.
const ICON_MAP: Record<string, LucideIcon> = {
  Wrench,
  Zap,
  Hammer,
  Paintbrush,
  Sparkles,
  Settings,
  Scissors,
  HardHat,
  Flame,
  Car,
  Leaf,
  Monitor,
  Smile,
  BookOpen,
  Camera,
  Star,
  // lowercase aliases for resilience
  wrench: Wrench,
  zap: Zap,
  hammer: Hammer,
  paintbrush: Paintbrush,
  sparkles: Sparkles,
  settings: Settings,
  scissors: Scissors,
  hardhat: HardHat,
  flame: Flame,
  car: Car,
  leaf: Leaf,
  monitor: Monitor,
  smile: Smile,
  bookopen: BookOpen,
  camera: Camera,
  star: Star,
};

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Star;
}
