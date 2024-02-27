export const metadata = {
  title: '思い出MAP',
  description: 'このアプリは、時代の変化とともに消えゆく景色を残したいという思いから作られたアプリです。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
