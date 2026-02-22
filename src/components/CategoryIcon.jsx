// Central icon component mapping category names to Lucide icons
import { Flame, HeartPulse, LifeBuoy, BellRing, FlaskConical, Truck } from 'lucide-react';

const ICON_MAP = {
  fire:    Flame,
  aid:     HeartPulse,
  rescue:  LifeBuoy,
  alarm:   BellRing,
  hazmat:  FlaskConical,
  other:   Truck,
};

export default function CategoryIcon({ category, size = 14, className = '' }) {
  const Icon = ICON_MAP[category] || Truck;
  return <Icon size={size} className={className} />;
}
