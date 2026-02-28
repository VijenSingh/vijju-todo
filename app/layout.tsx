// app/layout.js
import './globals.css';
import StoreProvider from '@/store/StoreProvider'; // Import kiya

export const metadata = {
  title: 'Vijju Todo',
  description: 'Todo app with Jira integration',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body >
        {/* Provider se wrap kar diya */}
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}