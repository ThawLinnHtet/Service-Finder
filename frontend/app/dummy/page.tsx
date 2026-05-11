"use client"

import Script from "next/script";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./dummy.module.css";

interface Skill {
  id: number;
  name: string;
  removable?: boolean;
}

export default function TaskerProfileDashboard() {
  const pathname = usePathname();

  const skills: Skill[] = [
    { id: 1, name: "House cleaning", removable: true },
    { id: 2, name: "Repair", removable: true },
  ];

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"
        strategy="lazyOnload"
      />

      <div className={styles.dashboard}>
        <aside className={styles.sidebar}>
          <div className={styles.logo}>
            <span className={styles.logoText}>Logo</span>
          </div>

          <div className={styles.sidebarUser}>
            <div className={styles.avatarWrapper}>
              <i className="fa-solid fa-user text-4xl text-gray-300" />
              <div className={styles.avatarBadge}>
                <i className="fa-regular fa-clock text-[8px]" />
                <span className="text-[8px] font-bold">24h</span>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg">Tasker Name</h3>
              <p className="text-xs text-gray-400">kaung123@gmail.com</p>
            </div>
          </div>

          <nav className={styles.sidebarNav}>
            <Link href="#" className={`${styles.navLink} ${pathname === "/" ? styles.navLinkActive : ""}`}>
              <i className={`${styles.navIcon} fa-solid fa-house`} />
              <span>Dashboard</span>
            </Link>
            <Link href="#" className={`${styles.navLink} ${styles.navLinkActive}`}>
              <i className={`${styles.navIcon} fa-regular fa-circle-user`} />
              <span>Profile</span>
            </Link>
            <Link href="#" className={styles.navLink}>
              <i className={`${styles.navIcon} fa-regular fa-comment-dots`} />
              <span>Chat</span>
            </Link>
            <Link href="#" className={styles.navLink}>
              <i className={`${styles.navIcon} fa-solid fa-gear`} />
              <span>Setting</span>
            </Link>
            <Link href="#" className={styles.navLink}>
              <i className={`${styles.navIcon} fa-solid fa-arrow-right-from-bracket`} />
              <span>Exit</span>
            </Link>
          </nav>

          <div className={styles.sidebarFooter}>
            <button className={styles.logoutBtn}>
              <i className="fa-solid fa-arrow-right-from-bracket" />
              <span>log out</span>
            </button>
            <div className={styles.footerLink}>
              <Link href="#">Terms of Use and Privacy Policy</Link>
            </div>
          </div>
        </aside>

        <main className={styles.mainContent}>
          <div className={styles.topIcons}>
            <button className={styles.topIconBtn}>
              <i className="fa-solid fa-globe" />
            </button>
            <button className={styles.topIconBtn}>
              <i className="fa-regular fa-bell" />
            </button>
          </div>

          <header className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Hello, Tasker</h1>
            <p className={styles.pageSubtitle}>Everyday become good day with our services.</p>
          </header>

          <div className={styles.contentGrid}>
            <div className={styles.leftColumn}>
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>They talk about their story</h2>
                  <button className={styles.editBtn}>
                    <i className="fa-regular fa-pen-to-square" />
                  </button>
                </div>
                <p className={styles.storyText}>
                  Hello everyone, my name is Mg Aung Kaung Myat. How are you? 
                  I hope you are well and happy. As for me I am ... 
                  <span className={styles.readMore}>Read more</span>
                </p>
              </section>

              <section>
                <h2 className={styles.overviewTitle}>Overview</h2>
                <hr className={styles.overviewDivider} />

                <div className={styles.formGrid}>
                  <div className={styles.formField}>
                    <div className={styles.fieldHeader}>
                      <label className={styles.fieldLabel}>Tasker Name</label>
                      <button className={styles.editBtn}>
                        <i className="fa-regular fa-pen-to-square text-xs" />
                      </button>
                    </div>
                    <input type="text" defaultValue="Aung Kaung Myat" className={styles.fieldInput} readOnly />
                  </div>

                  <div className={styles.formField}>
                    <div className={styles.fieldHeader}>
                      <label className={styles.fieldLabel}>Specific Skill</label>
                      <button className={styles.editBtn}>
                        <i className="fa-regular fa-pen-to-square text-xs" />
                      </button>
                    </div>
                    <div className={styles.skillsContainer}>
                      {skills.map((skill) => (
                        <span key={skill.id} className={styles.skillTag}>
                          {skill.name}
                          {skill.removable && (
                            <i className={`${styles.skillRemove} fa-solid fa-circle-minus`} />
                          )}
                        </span>
                      ))}
                      <button className={styles.addSkillBtn}>+ Add skill</button>
                    </div>
                  </div>

                  <div className={styles.formField}>
                    <div className={styles.fieldHeader}>
                      <label className={styles.fieldLabel}>Password</label>
                      <button className={styles.editBtn}>
                        <i className="fa-regular fa-pen-to-square text-xs" />
                      </button>
                    </div>
                    <div className={styles.inputWrapper}>
                      <input type="password" defaultValue="............" className={styles.fieldInput} readOnly />
                      <i className={`${styles.inputIcon} fa-regular fa-eye-slash`} />
                    </div>
                  </div>

                  <div className={styles.formField}>
                    <div className={styles.fieldHeader}>
                      <label className={styles.fieldLabel}>Location</label>
                      <button className={styles.editBtn}>
                        <i className="fa-regular fa-pen-to-square text-xs" />
                      </button>
                    </div>
                    <input type="text" defaultValue="Haling, Yangon, Myanmar" className={styles.fieldInput} readOnly />
                  </div>

                  <div className={styles.formField}>
                    <div className={styles.fieldHeader}>
                      <label className={styles.fieldLabel}>Ph No</label>
                      <button className={styles.editBtn}>
                        <i className="fa-regular fa-pen-to-square text-xs" />
                      </button>
                    </div>
                    <input type="text" defaultValue="09774271230" className={styles.fieldInput} readOnly />
                  </div>

                  <div className={styles.formField}>
                    <div className={styles.fieldHeader}>
                      <label className={styles.fieldLabel}>Service Area</label>
                      <button className={styles.editBtn}>
                        <i className="fa-regular fa-pen-to-square text-xs" />
                      </button>
                    </div>
                    <input type="text" defaultValue="Yangon" className={styles.fieldInput} readOnly />
                  </div>

                  <div className={styles.formField}>
                    <div className={styles.fieldHeader}>
                      <label className={styles.fieldLabel}>Email</label>
                      <button className={styles.editBtn}>
                        <i className="fa-regular fa-pen-to-square text-xs" />
                      </button>
                    </div>
                    <input type="email" defaultValue="kaung123@gmail.com" className={styles.fieldInput} readOnly />
                  </div>
                </div>
              </section>
            </div>

            <div className={styles.rightColumn}>
              <div className={styles.profileCard}>
                <div className={styles.profileAvatar}>
                  <i className={`${styles.profileAvatarIcon} fa-solid fa-user`} />
                  <button className={styles.profileAvatarBtn}>
                    <i className="fa-regular fa-pen-to-square text-sm" />
                  </button>
                </div>

                <div className={styles.profileDivider} />

                <div className={styles.ratingStars}>
                  <i className="fa-solid fa-star" />
                  <i className="fa-solid fa-star" />
                  <i className="fa-solid fa-star" />
                  <i className="fa-solid fa-star" />
                  <i className="fa-solid fa-star-half-stroke" />
                </div>
                <p className={styles.ratingText}>based on 20 Review</p>

                <div className={styles.feeBox}>
                  <div className={styles.feeRow}>
                    <div className={styles.feeIconBox}>
                      <i className={`${styles.feeIcon} fa-solid fa-gift`} />
                    </div>
                    <div className={styles.feeContent}>
                      <span className={styles.feeLabel}>Your customer services fee</span>
                      <span className={styles.feeValue}>From 20000MMK</span>
                    </div>
                  </div>

                  <button className={styles.requestPriceBtn}>Request more price</button>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.pageFooter}>
            <button className={styles.saveBtn}>Save</button>
          </div>
        </main>
      </div>
    </>
  );
}