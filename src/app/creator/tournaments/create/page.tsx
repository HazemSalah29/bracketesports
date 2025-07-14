import { CreateTournamentForm } from '@/components/creators/CreateTournamentForm'

// Mock function - replace with real authentication
async function getCurrentUser() {
  return {
    id: 'user_123',
    username: 'testcreator',
    email: 'creator@example.com',
    creator: {
      id: 'creator_123',
      tier: 'PARTNER' as const,
      status: 'APPROVED',
      totalEarnings: 2450.75,
      revenueShare: 70
    }
  }
}

export default async function CreateTournamentPage() {
  const user = await getCurrentUser()
  
  if (!user?.creator || user.creator.status !== 'APPROVED') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h1 className="text-lg font-semibold text-red-800 mb-2">
              Access Denied
            </h1>
            <p className="text-red-700">
              You need to be an approved creator to create tournaments.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Tournament</h1>
          <p className="text-gray-600 mt-1">
            Set up a new tournament for your community to enjoy!
          </p>
        </div>
        
        <CreateTournamentForm user={user} />
      </div>
    </div>
  )
}
