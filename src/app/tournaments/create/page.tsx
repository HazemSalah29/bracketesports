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
    tournamentFormat: 'elimination', // RIOT COMPLIANCE: Traditional tournament format required
    entryFee: '0',
    entryFeeCurrency: 'USD',
    prizeDistribution: 'fiat', // RIOT COMPLIANCE: Prize distribution in fiat currency
    allowCoinPayment: false, // RIOT COMPLIANCE: Optional coin payment for fiat equivalent
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
    
    // RIOT COMPLIANCE: Minimum 20 participants required
    const maxParticipants = parseInt(formData.maxParticipants)
    if (maxParticipants < 20) {
      newErrors.maxParticipants = 'Riot Games API policy requires minimum 20 participants for tournaments'
    }
    
    // RIOT COMPLIANCE: Entry fee validation (nominal amounts only)
    const entryFee = parseFloat(formData.entryFee)
    if (entryFee > 50) {
      newErrors.entryFee = 'Entry fee must be nominal (maximum $50 USD equivalent)'
    }
    
    // RIOT COMPLIANCE: Tournament format validation
    if (!formData.tournamentFormat) {
      newErrors.tournamentFormat = 'Tournament format is required'
    }
    
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

        {/* RIOT GAMES API COMPLIANCE NOTICE */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-8">
          <div className="flex items-start space-x-3">
            <InformationCircleIcon className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-blue-400 font-medium mb-2">Riot Games API Compliance</h3>
              <div className="text-sm text-slate-300 space-y-1">
                <p>• Tournaments must have a minimum of 20 participants</p>
                <p>• Only traditional tournament formats are allowed (elimination, round-robin, etc.)</p>
                <p>• Entry fees are optional - tournaments can be completely free</p>
                <p>• Entry fees must be nominal (maximum $50 USD equivalent) and displayed in fiat currency</p>
                <p>• Prize distribution must be in fiat currency based on tournament placements</p>
                <p>• Team captains can join tournaments on behalf of their entire team</p>
                <p>• No gambling, betting, or wagering features permitted</p>
                <p>• All features must be equally accessible to all participants</p>
                <p>• Coins may be used as payment method but entry fees and prizes must show fiat equivalent</p>
              </div>
            </div>
          </div>
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
                  Max Participants *
                  <span className="text-xs text-blue-400 ml-2">(Min. 20 required by Riot Games API policy)</span>
                </label>
                <div className="relative">
                  <UserGroupIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
                  >
                    <option value="20">20 Players</option>
                    <option value="24">24 Players</option>
                    <option value="32">32 Players</option>
                    <option value="48">48 Players</option>
                    <option value="64">64 Players</option>
                    <option value="96">96 Players</option>
                    <option value="128">128 Players</option>
                  </select>
                </div>
                {errors.maxParticipants && <p className="mt-1 text-sm text-red-400">{errors.maxParticipants}</p>}
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
                  <option value="solo">Individual Players (Battle Royale, 1v1, etc.)</option>
                  <option value="team">Team-based (Team captain joins for entire team)</option>
                  <option value="mixed">Mixed (Both solo players and teams allowed)</option>
                </select>
                <p className="mt-1 text-xs text-slate-400">
                  {formData.tournamentType === 'solo' && 'Individual players join directly. Perfect for battle royale games.'}
                  {formData.tournamentType === 'team' && 'Team captains join on behalf of their entire team.'}
                  {formData.tournamentType === 'mixed' && 'Both individual players and teams can participate.'}
                </p>
              </div>
              
              {(formData.tournamentType === 'team' || formData.tournamentType === 'mixed') && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Team Size (for team-based participation)
                  </label>
                  <select
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
                  >
                    <option value="2">2 Players per Team</option>
                    <option value="3">3 Players per Team</option>
                    <option value="4">4 Players per Team</option>
                    <option value="5">5 Players per Team (Standard for MOBAs)</option>
                    <option value="6">6 Players per Team</option>
                  </select>
                  <p className="mt-1 text-xs text-slate-400">
                    Team captains will join on behalf of their entire team. All team members automatically participate.
                  </p>
                </div>
              )}

              {/* RIOT COMPLIANCE: Tournament Format Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tournament Format *
                  <span className="text-xs text-blue-400 ml-2">(Traditional formats required by Riot Games API policy)</span>
                </label>
                <select
                  name="tournamentFormat"
                  value={formData.tournamentFormat}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
                >
                  <option value="elimination">Single Elimination</option>
                  <option value="double-elimination">Double Elimination</option>
                  <option value="round-robin">Round Robin</option>
                  <option value="swiss">Swiss System</option>
                </select>
                {errors.tournamentFormat && <p className="mt-1 text-sm text-red-400">{errors.tournamentFormat}</p>}
              </div>

              {/* RIOT COMPLIANCE: Entry Fee (Optional - Can be Free) */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Entry Fee (Optional)
                  <span className="text-xs text-yellow-400 ml-2">(Leave at $0 for free tournaments or maximum $50 USD)</span>
                </label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">$</span>
                    <input
                      type="number"
                      name="entryFee"
                      value={formData.entryFee}
                      onChange={handleInputChange}
                      min="0"
                      max="50"
                      step="0.01"
                      className="w-full pl-8 pr-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                  <select
                    name="entryFeeCurrency"
                    value={formData.entryFeeCurrency}
                    onChange={handleInputChange}
                    className="px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                  </select>
                </div>
                {errors.entryFee && <p className="mt-1 text-sm text-red-400">{errors.entryFee}</p>}
                <p className="mt-1 text-xs text-slate-400">
                  {parseFloat(formData.entryFee) === 0 
                    ? "Free tournament - no entry fee required."
                    : "Entry fees must be nominal and will be distributed to winners in fiat currency."
                  }
                </p>
              </div>

              {/* RIOT COMPLIANCE: Prize Distribution (Fiat Currency Required) */}
              {parseFloat(formData.entryFee) > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Prize Distribution *
                    <span className="text-xs text-blue-400 ml-2">(Required by Riot Games policy for paid tournaments)</span>
                  </label>
                  <select
                    name="prizeDistribution"
                    value={formData.prizeDistribution}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
                  >
                    <option value="fiat">Fiat Currency Distribution (Compliant)</option>
                  </select>
                  <p className="mt-1 text-xs text-slate-400">
                    Prize pool will be distributed in {formData.entryFeeCurrency} to winning participants based on tournament placements.
                  </p>
                </div>
              )}

              {/* RIOT COMPLIANCE: Coin Payment Option */}
              {parseFloat(formData.entryFee) > 0 && (
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="allowCoinPayment"
                      checked={formData.allowCoinPayment}
                      onChange={handleInputChange}
                      className="w-4 h-4 bg-slate-700 border border-slate-600 rounded text-gaming-500 focus:ring-gaming-500 focus:ring-2"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-slate-300">
                        Allow Coin Payment (Optional)
                      </span>
                      <p className="text-xs text-slate-400 mt-1">
                        Players can pay entry fee using Bracket Coins (fiat equivalent: ${formData.entryFee} {formData.entryFeeCurrency}).
                        Prizes will still be distributed in fiat currency.
                      </p>
                    </div>
                  </label>
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
