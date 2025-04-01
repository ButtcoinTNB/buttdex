import { WalletProvider } from '@/components/WalletProvider'
import { ThemeProvider } from '@/components/theme-provider'
import PhantomMobileRedirect from '@/components/PhantomMobileRedirect'
import { Ubuntu } from 'next/font/google'
import './globals.css'

const ubuntu = Ubuntu({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL('https://buttdex.com'),
  title: 'ButtDex - Swap SOL and Buttcoin | Best Solana DEX for BUTTCOIN',
  description: 'ButtDex is the premier decentralized exchange for swapping SOL and Buttcoin with the lowest fees and best rates on Solana blockchain.',
  keywords: 'ButtDex, Buttcoin, BUTT, SOL, Solana DEX, cryptocurrency exchange, swap, crypto, Jupiter aggregator',
  openGraph: {
    title: 'ButtDex - Swap SOL and Buttcoin | Best Solana DEX for BUTTCOIN',
    description: 'ButtDex is the premier decentralized exchange for swapping SOL and Buttcoin with the lowest fees and best rates on Solana blockchain.',
    url: 'https://buttdex.com/',
    siteName: 'ButtDex',
    images: [
      {
        url: 'https://ipfs.io/ipfs/bafkreic4h3qlk5ezs2ajufdtfvpaqcm7ogabsj4kbghthosc6bw6s3kwry',
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ButtDex - Swap SOL and Buttcoin | Best Solana DEX for BUTTCOIN',
    description: 'ButtDex is the premier decentralized exchange for swapping SOL and Buttcoin with the lowest fees and best rates on Solana blockchain.',
    images: ['https://ipfs.io/ipfs/bafkreic4h3qlk5ezs2ajufdtfvpaqcm7ogabsj4kbghthosc6bw6s3kwry'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </head>
      <body className={ubuntu.className}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark" 
          enableSystem
          enableColorScheme
          disableTransitionOnChange={false}
          storageKey="buttdex-theme"
        >
          <WalletProvider>
            {children}
            <PhantomMobileRedirect />
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
} 