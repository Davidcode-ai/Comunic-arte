import {
  Angry,
  Clock,
  CupSoda,
  Frown,
  Gamepad2,
  HelpCircle,
  Home,
  Moon,
  MoonStar,
  School,
  Smile,
  Sunrise,
  Trees,
  User,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  Smile,
  Frown,
  Angry,
  Home,
  School,
  Trees,
  UtensilsCrossed,
  CupSoda,
  Gamepad2,
  Moon,
  User,
  Users,
  Sunrise,
  MoonStar,
  Clock,
}

export function getLucideIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? HelpCircle
}
