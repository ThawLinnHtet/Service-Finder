import styles from "../register.module.css"

interface TaskerData {
  name: string
  phone: string
  email: string
  password: string
  specificSkill: string
  currentLocation: string
  serviceArea: string
  serviceDescription: string
  baseRate: string
  experienceYear: string
  nrcFullForm: string
  nrcFront: string
  nrcBack: string
}

const fields: { label: string; key: keyof TaskerData; vertical?: boolean }[] = [
  { label: "Name", key: "name" },
  { label: "Ph No", key: "phone" },
  { label: "Email", key: "email" },
  { label: "Password", key: "password" },
  { label: "Specific Skill", key: "specificSkill" },
  { label: "Current Location", key: "currentLocation" },
  { label: "Service Area", key: "serviceArea" },
  { label: "Service Description", key: "serviceDescription", vertical: true },
  { label: "Base Rate(MMK)", key: "baseRate" },
  { label: "Experience Year", key: "experienceYear" },
  { label: "NRC Full Form", key: "nrcFullForm" },
]

export default function ProviderFormFields({ data }: { data: TaskerData }) {
  return (
    <div className={styles.formContent}>
      {fields.map((f) => (
        <div key={f.key} className={f.vertical ? styles.formRowVertical : styles.formRow}>
          <span className={styles.formLabel}>{f.label} :</span>
          {f.vertical ? (
            <span className={styles.descriptionPlaceholder}>
              {data[f.key] || "(No description provided)"}
            </span>
          ) : (
            <span className={styles.formValue}>{data[f.key]}</span>
          )}
        </div>
      ))}
    </div>
  )
}
