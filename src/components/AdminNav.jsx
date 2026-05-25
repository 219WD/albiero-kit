import './AdminNav.css';
import { getStoredAdmin } from '../utils/adminSession';

const links = [
  { href: '/analiticas', label: 'Analiticas' },
  { href: '/emailmkt', label: 'Email MKT' },
  { href: '/usuarios', label: 'Usuarios', superOnly: true },
];

export default function AdminNav() {
  const pathname = window.location.pathname;
  const admin = getStoredAdmin();

  return (
    <nav className="admin-nav" aria-label="Navegacion admin">
      {links
        .filter((link) => !link.superOnly || admin?.rango === 'superadmin')
        .map((link) => (
          <a
            key={link.href}
            className={pathname.startsWith(link.href) ? 'is-active' : ''}
            href={link.href}
          >
            {link.label}
          </a>
        ))}
    </nav>
  );
}
