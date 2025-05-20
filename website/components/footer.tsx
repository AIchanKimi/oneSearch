export default function Footer() {
  return (
    <footer className="w-full text-center py-8 text-gray-400 text-sm border-t border-gray-100 bg-gray-50 mt-auto">
      ©
      {' '}
      {new Date().getFullYear()}
      {' '}
      OneSearch. All rights reserved.
    </footer>
  )
}
