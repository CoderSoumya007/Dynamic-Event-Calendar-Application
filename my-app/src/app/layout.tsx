import './globals.css'
import { CalendarProvider } from '../contexts/CalendarContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <CalendarProvider>
          {children}
        </CalendarProvider>
      </body>
    </html>
  )
}

