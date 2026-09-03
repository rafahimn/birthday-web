import './globals.css';
export const metadata={title:'Birthday Builder',description:'Create interactive birthday websites.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}