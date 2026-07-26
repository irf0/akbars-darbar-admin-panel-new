import { NavLink } from 'react-router-dom';
import {
  ClipboardList,
  UtensilsCrossed,
  BarChart3,
  Settings,
  Ticket,
  MessageSquareText,
  History,
  Users,
} from 'lucide-react';
import ReloadButton from './ReloadButton';

const navItems = [
  { to: '/orders', label: 'Orders', icon: ClipboardList },
  { to: '/menu', label: 'Menu', icon: UtensilsCrossed },
  // { to: '/delivery', label: 'Out for Delivery', icon: Bike },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/coupons', label: 'Coupons', icon: Ticket },
  { to: '/riders', label: 'Riders', icon: Users },
  { to: '/reviews', label: 'Reviews', icon: MessageSquareText },
  { to: '/orders/history', label: 'Order History', icon: History },
];

function Sidebar() {
  return (
    <aside className="w-[200px] h-full border-r border-border flex flex-col p-3 gap-1 bg-white">
      <ReloadButton />
      <p className="font-medium text-[15px] mb-4 px-1 text-primary">{"Akbar's Darbar"}</p>

      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm ${
                isActive
                  ? 'bg-primary-light text-primary font-medium'
                  : 'text-text-secondary hover:bg-surface'
              }`
            }>
            <Icon size={18} strokeWidth={2} />
            {item.label}
          </NavLink>
        );
      })}
    </aside>
  );
}

export default Sidebar;
