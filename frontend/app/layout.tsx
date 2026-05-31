// import Image from "next/image";
// import type { ReactNode } from "react";
// import { StoreProvider } from "./StoreProvider";
// import { Nav } from "./components/Nav";

// import "./styles/globals.css";
// import styles from "./styles/layout.module.css";

// interface Props {
//   readonly children: ReactNode;
// }

// export default function RootLayout({ children }: Props) {
//   return (
//     <StoreProvider>
//       <html lang="en">
//         <body>
//           <section className={styles.container}>
//             <Nav />

//             <header className={styles.header}>
//               <Image
//                 src="/logo.svg"
//                 className={styles.logo}
//                 alt="logo"
//                 width={100}
//                 height={100}
//               />
//             </header>

//             <main className={styles.main}>{children}</main>

//             <footer className={styles.footer}>
//               <span>Learn </span>
//               <a
//                 className={styles.link}
//                 href="https://reactjs.org"
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 React
//               </a>
//               <span>, </span>
//               <a
//                 className={styles.link}
//                 href="https://redux.js.org"
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 Redux
//               </a>
//               <span>, </span>
//               <a
//                 className={styles.link}
//                 href="https://redux-toolkit.js.org"
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 Redux Toolkit
//               </a>
//               <span>, </span>
//               <a
//                 className={styles.link}
//                 href="https://react-redux.js.org"
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 React Redux
//               </a>
//               ,<span> and </span>
//               <a
//                 className={styles.link}
//                 href="https://reselect.js.org"
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 Reselect
//               </a>
//             </footer>
//           </section>
//         </body>
//       </html>
//     </StoreProvider>
//   );
// }


import type { ReactNode } from "react";
import { StoreProvider } from "./StoreProvider";

import "./styles/globals.css";

interface Props {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <StoreProvider>
      <html lang="en">
        <head>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@700&family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Pacifico&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          />
        </head>
        <body style={{ fontFamily: "'Fraunces', serif" }}>{children}</body>
      </html>
    </StoreProvider>
  );
}
