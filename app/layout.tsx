import Providers from "./providers"
import "../styles/globals.css"
import Login from "./Login"
import { NavBar } from "./components/NavBar"

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
            <NavBar />
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
