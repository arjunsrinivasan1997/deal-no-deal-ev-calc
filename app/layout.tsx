import './globals.css'
import {ThemeProvider} from "@/components/theme-provider"


export const metadata = {
    title: 'Deal or No Deal EV Calculator',
    description: 'An Expected Value calculator for the Deal or No Deal game show',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head/>
        <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
        </ThemeProvider>
        </body>
        </html>
    )
}
