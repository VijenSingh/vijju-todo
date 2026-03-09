// app/layout.js
import './globals.css';
import StoreProvider from '@/store/StoreProvider'; // Import kiya

export const metadata = {
  title: 'Vijju Todo',
  description: 'Todo app with Jira integration',
  // Favicon/icon configuration; point to any image in the public folder
  icons: {
    icon: '/vijju.png', // using the image you dropped in public/
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* explicit link as a backup for browsers that don't read metadata */}
        <link rel="icon" href="/vijju.png" />
      </head>
      <body >
        {/* Provider se wrap kar diya */}
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}