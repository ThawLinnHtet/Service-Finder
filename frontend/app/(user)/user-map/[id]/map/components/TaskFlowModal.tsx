"use client"

import { X, User, MapPin, Calendar, Lock, ChevronDown, ArrowUpDown, Send, ThumbsUp, ThumbsDown } from "lucide-react"
import styles from "../map.module.css"

interface TaskFlowModalProps {
  open: boolean
  onClose: () => void
}

export default function TaskFlowModal({ open, onClose }: TaskFlowModalProps) {
  if (!open) return null
  return (
    <div className={styles.taskFlowOverlay} onClick={onClose}>
      <div className={styles.taskFlowModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.taskFlowHeader}>
          <div>
            <div className={styles.taskFlowBreadcrumb}>
              <span className={styles.breadcrumbItem}>Open</span>
              <span className={`${styles.breadcrumbItem} ${styles.breadcrumbActive}`}>Assigned</span>
              <span className={styles.breadcrumbItem}>Completed</span>
            </div>
            <h2 className={styles.taskFlowTitle}>Create a Happy Feeling with me. I can make everything you want.</h2>
          </div>
          <button className={styles.taskFlowCloseBtn} onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className={styles.taskFlowBody}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIconBox}><User className="w-5 h-5" /></div>
              <div>
                <span className={styles.statLabel}>Post By</span>
                <h4 className={styles.statValue}>Aung Kaung Myat</h4>
                <span className={styles.statSubtext}>about 19 hours ago</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIconBox}><MapPin className="w-5 h-5" /></div>
              <div>
                <span className={styles.statLabel}>Location</span>
                <h4 className={styles.statValue}>Pyay, Yangon</h4>
                <span className={styles.statSubtext}>Service Area</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIconBox}><Calendar className="w-5 h-5" /></div>
              <div>
                <span className={styles.statLabel}>To be done on</span>
                <h4 className={styles.statValue}>Today</h4>
                <span className={styles.statSubtext}>Afternoon(2pm-6pm)</span>
              </div>
            </div>
          </div>

          <div className={styles.budgetBanner}>
            <span className={styles.budgetLabel}>Task Budget</span>
            <h3 className={styles.budgetAmount}>20000 MMK</h3>
            <div className={styles.budgetBadge}>Assigned</div>
            <p className={styles.budgetEscrow}><Lock className="w-3 h-3 inline-block mr-1" /> Payment held securely in Escrow</p>
          </div>

          <div className={styles.detailsBlock}>
            <div className={styles.detailsHeader}>
              <span className={styles.detailsLabel}>Details</span>
              <button className={styles.detailsToggle}>
                Less <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            <div className={styles.detailsContent}>
              <p>Builds their story based on mutual agreements and physical training goals. Ensuring all parts of the teaching syllabus is completely completed on time.</p>
              <p>We require someone with patience, extreme dedication and great communication skills. Materials are all provided.</p>
            </div>
          </div>

          <div className={styles.commentsSection}>
            <div className={styles.commentsHeader}>
              <h3 className={styles.commentsTitle}>Comments</h3>
              <button className={styles.commentsSortBtn}>
                <ArrowUpDown className="w-3.5 h-3.5" /> Sort by
              </button>
            </div>
            <div className={styles.commentInputRow}>
              <div className={styles.commentInputAvatar}>
                <User className="w-4 h-4" />
              </div>
              <div className={styles.commentInputWrap}>
                <input type="text" placeholder="Add a comment..." className={styles.commentInput} />
                <button className={styles.commentSendBtn}>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className={styles.commentFeed}>
              <div className={styles.commentItem}>
                <div className={styles.commentAvatar}>AK</div>
                <div className={styles.commentBody}>
                  <div className={styles.commentMeta}>
                    <span className={styles.commentUsername}>@aungkaungmyat</span>
                    <span className={styles.commentTime}>1 hour ago</span>
                  </div>
                  <p className={styles.commentText}>This guy is good and very very kind. High professional attitude and prompt response.</p>
                  <div className={styles.commentActions}>
                    <button className={styles.commentActionBtn}>
                      <ThumbsUp className="w-3 h-3" /> 15
                    </button>
                    <button className={styles.commentActionBtn}>
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                    <button className={styles.commentReplyBtn}>Reply</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.taskFlowFooter}>
          <button className={styles.taskFlowCancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.taskFlowConfirmBtn} onClick={onClose}>Confirm</button>
        </div>
      </div>
    </div>
  )
}
