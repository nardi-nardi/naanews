import Link from "next/link";

const AdminLink = () => {
  return (
    <Link
      href="/admin"
      className="glass-panel block rounded-2xl p-4 text-center text-sm font-medium text-amber-300 transition hover:border-amber-400/50"
    >
      🛠️ Admin Panel
    </Link>
  );
};

export default AdminLink;
