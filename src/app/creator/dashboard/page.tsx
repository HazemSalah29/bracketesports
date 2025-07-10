import { redirect } from 'next/navigation'
import { CreatorDashboard } from '@/components/creators/CreatorDashboard'

// Mock function - replace with real authentication
async function getCurrentUser() {
  // This would be replaced with actual session management
  return {
    id: 'user_123',
    username: 'testcreator',
    email: 'creator@example.com',
    creator: {
      id: 'creator_123',
      tier: 'PARTNER',
      status: 'APPROVED',
      totalEarnings: 2450.75,
      revenueShare: 70
    }
  }
}

export default async function CreatorDashboardPage() {
  const user = await getCurrentUser()
  
  if (!user?.creator) {
    redirect('/creator/apply')
  }

  if (user.creator.status === 'PENDING') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h1 className="text-lg font-semibold text-yellow-800 mb-2">
              Application Under Review
            </h1>
            <p className="text-yellow-700">
              Your creator application is being reviewed. You&apos;ll be notified via email once approved.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (user.creator.status === 'REJECTED') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h1 className="text-lg font-semibold text-red-800 mb-2">
              Application Not Approved
            </h1>
            <p className="text-red-700 mb-4">
              Unfortunately, your creator application was not approved at this time.
            </p>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
              Reapply
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CreatorDashboard user={user} />
    </div>
  )
}
