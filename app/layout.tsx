import Link from "next/link"
import Providers from "./providers"
import "../styles/globals.css"
import Login from "./Login"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html data-theme="emerald">
      <head />
      <body>
        <Providers>
          <nav className="navbar bg-primary">
            <div className="navbar-start"></div>
            <div className="navbar-center">
              <Link className="btn btn-ghost" href='/'>Home</Link>
              <Link className="btn btn-ghost" href='/brothers'>Brothers</Link>
              <Link className="btn btn-ghost" href='/events'>Events</Link>
              <Link className="btn btn-ghost" href='/message'>Message</Link>
            </div>
            <div className="navbar-end">
              <Login />
            </div>
          </nav>
          {children}
        </Providers>
      </body>
    </html>
  )
}
