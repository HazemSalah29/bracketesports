'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthValidation } from '@/hooks/useAuthValidation'
import AuthPrompt from '@/components/auth/AuthPrompt'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { GameIcon } from '@/components/ui/GameIcons'
import { 
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  StarIcon,
  UserGroupIcon,
  LockClosedIcon,
  GlobeAltIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'

const gameOptions = [
  { id: 'cs2', name: 'Counter-Strike 2' },
  { id: 'valorant', name: 'Valorant' },
  { id: 'rocket-league', name: 'Rocket League' },
  { id: 'lol', name: 'League of Legends' },
  { id: 'dota2', name: 'Dota 2' },
  { id: 'fortnite', name: 'Fortnite' },
  { id: 'apex', name: 'Apex Legends' },
  { id: 'overwatch2', name: 'Overwatch 2' },
]

export default function CreateTournamentPage() {
  const router = useRouter()
  const { validateAndPrompt, showPrompt, promptData, closePrompt } = useAuthValidation()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    game: '',
    pointsReward: '',
    maxParticipants: '32',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    registrationDeadline: '',
    registrationTime: '',
    isPrivate: false,
    password: '',
    skillLevel: 'all',
    tournamentType: 'solo',
    teamSize: '1',
    rules: '',
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [successMessage, setSuccessMessage] = useState('')

  // Check validation on component mount
  useEffect(() => {
    if (!validateAndPrompt('create a tournament')) {
      // Validation failed - user will see the prompt
      return
    }
  }, [validateAndPrompt])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.name.trim()) newErrors.name = 'Tournament name is required'
    if (!formData.game) newErrors.game = 'Please select a game'
    if (!formData.pointsReward || parseFloat(formData.pointsReward) < 0) newErrors.pointsReward = 'Valid points reward is required'
    if (!formData.startDate) newErrors.startDate = 'Start date is required'
    if (!formData.startTime) newErrors.startTime = 'Start time is required'
    if (!formData.endDate) newErrors.endDate = 'End date is required'
    if (!formData.endTime) newErrors.endTime = 'End time is required'
    if (!formData.registrationDeadline) newErrors.registrationDeadline = 'Registration deadline is required'
    if (!formData.registrationTime) newErrors.registrationTime = 'Registration time is required'
    if (formData.isPrivate && !formData.password.trim()) newErrors.password = 'Password is required for private tournaments'

    const selectedStartDate = new Date(`${formData.startDate}T${formData.startTime}`)
    const selectedEndDate = new Date(`${formData.endDate}T${formData.endTime}`)
    const registrationDeadline = new Date(`${formData.registrationDeadline}T${formData.registrationTime}`)
    
    if (selectedStartDate <= new Date()) {
      newErrors.startDate = 'Tournament must start in the future'
    }
    
    if (selectedEndDate <= selectedStartDate) {
      newErrors.endDate = 'Tournament end must be after start time'
    }
    
    if (registrationDeadline >= selectedStartDate) {
      newErrors.registrationDeadline = 'Registration must close before tournament starts'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('Form submitted!') // Debug log
    e.preventDefault()
    
    console.log('Form data:', formData) // Debug log
    
    if (!validateForm()) {
      console.log('Form validation failed', errors) // Debug log
      return
    }

    console.log('Form validation passed, creating tournament...') // Debug log
    setIsLoading(true)
    setSuccessMessage('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const pointsReward = parseInt(formData.pointsReward)

      // Create tournament object
      const newTournament = {
        ...formData,
        pointsReward,
        createdAt: new Date().toISOString(),
      }

      console.log('Tournament created:', newTournament)
      
      // Show success message
      setSuccessMessage('Tournament created successfully!')
      
      // Wait a moment to show success message
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Redirect to tournaments page to see the created tournament
      router.push('/tournaments')
    } catch (error) {
      console.error('Error creating tournament:', error)
      setErrors({ submit: 'Failed to create tournament. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }
  const estimatedPoints = formData.pointsReward && formData.maxParticipants
    ? parseInt(formData.pointsReward)
    : 0

  return (
    <ProtectedRoute>
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-slate-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          
          <h1 className="text-3xl font-bold text-white font-gaming mb-2">
            Create Tournament
          </h1>
          <p className="text-slate-400">
            Set up your own tournament with custom points rewards and achievement badges
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="text-green-400">✓</div>
                <span className="text-green-400 font-medium">{successMessage}</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="text-red-400">✗</div>
                <span className="text-red-400 font-medium">{errors.submit}</span>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tournament Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Winter Championship 2025"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
                />
                {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Describe your tournament, rules, and what makes it special..."
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Game *
                </label>
                <select
                  name="game"
                  value={formData.game}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
                >
                  <option value="">Select a game</option>
                  {gameOptions.map(game => (
                    <option key={game.id} value={game.name}>
                      {game.name}
                    </option>
                  ))}
                </select>
                {errors.game && <p className="mt-1 text-sm text-red-400">{errors.game}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Skill Level
                </label>
                <select
                  name="skillLevel"
                  value={formData.skillLevel}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tournament Setup */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Tournament Setup</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Points Reward *
                </label>
                <div className="relative">
                  <StarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    name="pointsReward"
                    value={formData.pointsReward}
                    onChange={handleInputChange}
                    min="0"
                    step="1"
                    placeholder="2500"
                    className="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
                  />
                </div>
                {errors.pointsReward && <p className="mt-1 text-sm text-red-400">{errors.pointsReward}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Max Participants
                </label>
                <div className="relative">
                  <UserGroupIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
                  >
                    <option value="8">8 Players</option>
                    <option value="16">16 Players</option>
                    <option value="32">32 Players</option>
                    <option value="64">64 Players</option>
                    <option value="128">128 Players</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Start Date *
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
                  />
                </div>
                {errors.startDate && <p className="mt-1 text-sm text-red-400">{errors.startDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Start Time *
                </label>
                <div className="relative">
                  <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
                  />
                </div>
                {errors.startTime && <p className="mt-1 text-sm text-red-400">{errors.startTime}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  End Date *
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
                  />
                </div>
                {errors.endDate && <p className="mt-1 text-sm text-red-400">{errors.endDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  End Time *
                </label>
                <div className="relative">
                  <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
                  />
                </div>
                {errors.endTime && <p className="mt-1 text-sm text-red-400">{errors.endTime}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Registration Deadline *
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    name="registrationDeadline"
                    value={formData.registrationDeadline}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    max={formData.startDate}
                    className="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
                  />
                </div>
                {errors.registrationDeadline && <p className="mt-1 text-sm text-red-400">{errors.registrationDeadline}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Registration Time *
                </label>
                <div className="relative">
                  <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="time"
                    name="registrationTime"
                    value={formData.registrationTime}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
                  />
                </div>
                {errors.registrationTime && <p className="mt-1 text-sm text-red-400">{errors.registrationTime}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tournament Type
                </label>
                <select
                  name="tournamentType"
                  value={formData.tournamentType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
                >
                  <option value="solo">Solo Players</option>
                  <option value="team">Team-based</option>
                  <option value="mixed">Mixed (Solo & Team)</option>
                </select>
              </div>
              
              {formData.tournamentType === 'team' && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Team Size
                  </label>
                  <select
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
                  >
                    <option value="2">2 Players</option>
                    <option value="3">3 Players</option>
                    <option value="4">4 Players</option>
                    <option value="5">5 Players</option>
                    <option value="6">6 Players</option>
                  </select>
                </div>
              )}
            </div>

            {/* Points Reward Display */}
            {estimatedPoints > 0 && (
              <div className="mt-6 p-4 bg-gaming-900/20 border border-gaming-500/30 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <InformationCircleIcon className="w-5 h-5 text-gaming-400" />
                  <span className="text-sm font-medium text-gaming-400">Points Reward</span>
                </div>
                <div className="text-2xl font-bold text-accent-500 points-glow">
                  {estimatedPoints.toLocaleString()}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Winner receives {estimatedPoints.toLocaleString()} points + achievement badges
                </p>
              </div>
            )}
          </div>

          {/* Privacy Settings */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Privacy & Access</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isPrivate"
                  name="isPrivate"
                  checked={formData.isPrivate}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-gaming-600 bg-slate-700 border-slate-600 rounded focus:ring-gaming-500"
                />
                <label htmlFor="isPrivate" className="flex items-center text-slate-300">
                  {formData.isPrivate ? (
                    <LockClosedIcon className="w-4 h-4 mr-2 text-accent-400" />
                  ) : (
                    <GlobeAltIcon className="w-4 h-4 mr-2 text-gaming-400" />
                  )}
                  Make this tournament private
                </label>
              </div>
              
              {formData.isPrivate && (
                <div className="ml-7">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tournament Password *
                  </label>
                  <input
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter a password for your tournament"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
                  />
                  {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
                  <p className="mt-1 text-xs text-slate-400">
                    Players will need this password to join your tournament
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                console.log('Test button clicked!')
                console.log('Current form data:', formData)
                console.log('Current errors:', errors)
              }}
              className="px-4 py-3 border border-blue-600 text-blue-400 rounded-lg hover:bg-blue-600/10 transition-colors"
            >
              Debug
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gaming-600 hover:bg-gaming-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed neon-glow flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Tournament...
                </>
              ) : (
                'Create Tournament'
              )}
            </button>
          </div>
        </form>
        
        {/* Auth Prompt */}
        {showPrompt && promptData && (
          <AuthPrompt
            isOpen={showPrompt}
            onClose={closePrompt}
            title={promptData.title}
            message={promptData.message}
            actionType={promptData.actionType}
          />
        )}
      </div>
    </div>
    </ProtectedRoute>
  )
}
