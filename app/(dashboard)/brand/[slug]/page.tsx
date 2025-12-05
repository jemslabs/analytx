
"use client"
import { useParams } from 'next/navigation'

function BrandDashboard() {
  const params = useParams()
  const slug = params.slug;
  return (
    <div className="min-h-screen">BrandDashboard</div>
  )
}

export default BrandDashboard