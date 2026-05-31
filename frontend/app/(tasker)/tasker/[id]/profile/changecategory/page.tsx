"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import styles from "./changecategory.module.css"
import CategoryGrid from "./components/CategoryGrid"
import SkillChips from "./components/SkillChips"
import AddSkillModal from "./components/AddSkillModal"
import SuccessModal from "./components/SuccessModal"
import Illustration from "./components/Illustration"

export default function ChangeCategoryPage() {
  const router = useRouter()
  const params = useParams()
  const [selectedCategory, setSelectedCategory] = useState("cleaning")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [baseRate, setBaseRate] = useState("")
  const [experienceYear, setExperienceYear] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [changeReason, setChangeReason] = useState("")
  const [addSkillOpen, setAddSkillOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [validationError, setValidationError] = useState(false)

  const handleSelectCategory = (id: string) => {
    setSelectedCategory(id)
    setValidationError(false)
  }

  const handleToggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  const handleAddSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills((prev) => [...prev, skill])
    }
    setAddSkillOpen(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCategory) {
      setValidationError(true)
      setTimeout(() => setValidationError(false), 3000)
      return
    }
    setSuccessOpen(true)
  }

  const handleBack = () => {
    setSelectedCategory("cleaning")
    setSelectedSkills([])
    setBaseRate("")
    setExperienceYear("")
    setJobTitle("")
    setChangeReason("")
    setValidationError(false)
    router.push(`/tasker/${params.id}/profile`)
  }

  const categoryLabel =
    selectedCategory
      ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) + " Services"
      : "-"

  const recapData = {
    category: categoryLabel,
    title: jobTitle || "Not Specified",
    rate: baseRate ? Number(baseRate).toLocaleString() + " MMK" : "-",
    experience: experienceYear ? experienceYear + (experienceYear === "1" ? " Year" : " Years") : "-",
    skills: selectedSkills.length > 0 ? selectedSkills.join(", ") : "None selected",
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.header}>
              <h1 className={styles.title}>Service Information</h1>
              <p className={styles.subtitle}>Tell us about the services you updated.</p>
            </div>

            <div className={styles.categoryField}>
              <label className={styles.fieldLabel}>Select Primary Category</label>
              <div className={validationError ? styles.validationRing : ""}>
                <CategoryGrid selected={selectedCategory} onSelect={handleSelectCategory} />
              </div>
              <input type="hidden" value={selectedCategory} />
            </div>

            <hr className={styles.divider} />

            <div className={styles.skillsField}>
              <label className={styles.fieldLabel}>Specific Skills (Select multiple)</label>
              <SkillChips selected={selectedSkills} onToggle={handleToggleSkill} onAddSkill={() => setAddSkillOpen(true)} />
            </div>

            <div className={styles.row}>
              <div className={styles.inputWrapper}>
                <label className={styles.fieldLabel}>Base Rate (MMK)</label>
                <div className={styles.inputGroup}>
                  <input
                    type="number"
                    value={baseRate}
                    onChange={(e) => setBaseRate(e.target.value)}
                    placeholder="e.g. 150000"
                    className={styles.input}
                    required
                  />
                  <span className={styles.inputSuffix}>MMK</span>
                </div>
              </div>

              <div className={styles.inputWrapper}>
                <label className={styles.fieldLabel}>Experience Year</label>
                <div className={styles.inputGroup}>
                  <select
                    value={experienceYear}
                    onChange={(e) => setExperienceYear(e.target.value)}
                    className={styles.select}
                    required
                  >
                    <option value="" disabled>YY</option>
                    <option value="1">1 Year</option>
                    <option value="2">2 Years</option>
                    <option value="3">3 Years</option>
                    <option value="4">4 Years</option>
                    <option value="5">5+ Years</option>
                    <option value="10">10+ Years</option>
                  </select>
                  <div className={styles.selectArrow}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.fieldLabel}>Job Title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Enter your title"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputWrapper}>
              <label className={styles.fieldLabel}>Your reason for changed service</label>
              <textarea
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
                rows={4}
                placeholder="Explain why you change this service?"
                className={styles.textarea}
              />
            </div>

            <div className={styles.actions}>
              <button type="button" onClick={handleBack} className={styles.btnBack}>Back</button>
              <button type="submit" className={styles.btnContinue}>Continue</button>
            </div>
          </form>

          <Illustration />
        </div>
      </div>

      <AddSkillModal
        open={addSkillOpen}
        onClose={() => setAddSkillOpen(false)}
        onAdd={handleAddSkill}
      />

      <SuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        recap={recapData}
      />
    </div>
  )
}
