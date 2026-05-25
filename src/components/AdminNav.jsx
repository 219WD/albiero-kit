import './AdminNav.css';

const links = [
  { href: '/analiticas', label: 'Analiticas' },
  { href: '/emailmkt', label: 'Email MKT' },
];

export default function AdminNav() {
  const pathname = window.location.pathname;

  return (
    <nav className="admin-nav" aria-label="Navegacion admin">
      {links.map((link) => (
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
