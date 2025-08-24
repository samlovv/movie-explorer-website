export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 text-gray-400 text-center text-sm py-6 mt-12">
      <p>© {new Date().getFullYear()} Movie Explorer. All rights reserved.</p>
    </footer>
  );
}
