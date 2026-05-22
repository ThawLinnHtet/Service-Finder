"use client"

import styles from "../dashboard.module.css"

export default function NewBookingRequests() {
  return (
    <section className={styles.card}>
      <h3 className={styles.cardTitle}>New Booking Requests</h3>
      <div className={styles.bookingList}>
        <div className={styles.bookingItem}>
          <div className={styles.bookingInfo}>
            <div className={styles.bookingAvatar} />
            <div>
              <h4 className={styles.bookingTitle}>Cleaning</h4>
              <p className={styles.bookingLocation}>Location, Haling Township</p>
              <p className={styles.bookingDate}>• Today</p>
            </div>
          </div>
          <div className={styles.bookingActions}>
            <button className={styles.declineBtn}>Decline</button>
            <button className={styles.acceptBtn}>Accept</button>
          </div>
        </div>
        <div className={styles.bookingItem}>
          <div className={styles.bookingInfo}>
            <div className={styles.bookingAvatar} />
            <div>
              <h4 className={styles.bookingTitle}>Repair</h4>
              <p className={styles.bookingLocation}>Location, Haling Township</p>
              <p className={styles.bookingDate}>• Today</p>
            </div>
          </div>
          <div className={styles.bookingActions}>
            <button className={styles.declineBtn}>Decline</button>
            <button className={styles.acceptBtn}>Accept</button>
          </div>
        </div>
      </div>
    </section>
  )
}
