"use client"

import styles from "../dashboard/dashboard.module.css"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerBrand}>
          <h1 className={styles.footerLogo}>LOGO</h1>
          <p className={styles.footerCopyright}>@2026 Project. Dependable services for your home.</p>
        </div>
        <div className={styles.footerColumn}>
          <h4 className={styles.footerColumnTitle}>Contact Us</h4>
          <a href="#" className={styles.footerLink}>About</a>
          <a href="#" className={styles.footerLink}>Terms of Services</a>
        </div>
        <div className={styles.footerColumn}>
          <h4 className={styles.footerColumnTitle}>Support</h4>
          <a href="#" className={styles.footerLink}>Privacy Policy</a>
          <a href="#" className={styles.footerLink}>Contact support</a>
        </div>
        <div className={styles.footerColumn}>
          <h4 className={styles.footerColumnTitle}>Connect</h4>
          <a href="#" className={styles.footerLink}>YouTube</a>
          <a href="#" className={styles.footerLink}>Telegram</a>
        </div>
      </div>
    </footer>
  )
}
