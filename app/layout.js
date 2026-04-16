// app/layout.jsx
import './globals.css';

export const metadata = {
  title: 'Analytics Dashboard | Date Charts & Graphs',
  description: 'Interactive analytics dashboard with date-based charts',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" 
        />
      </head>
      <body>{children}</body>
    </html>
  );
}