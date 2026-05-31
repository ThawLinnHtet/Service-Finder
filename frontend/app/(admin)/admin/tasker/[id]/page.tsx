"use client"

import { redirect } from "next/navigation"
import { useParams } from "next/navigation"

export default function TaskerIndexPage() {
  const params = useParams()
  const id = params.id

  if (id) {
    redirect(`/admin/tasker/${id}/registerapprove`)
  }

  return null
}
