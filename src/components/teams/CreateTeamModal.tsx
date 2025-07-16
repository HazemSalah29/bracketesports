'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { apiClient } from '@/lib/api-client';
import {
  XMarkIcon,
  PhotoIcon,
  GlobeAltIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import { Team, TeamRank } from '@/types';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTeamCreated: (team: Team) => void;
}

export default function CreateTeamModal({ isOpen, onClose, onTeamCreated }: CreateTeamModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrivate: false,
    maxMembers: 5,
  });
  const [teamLogo, setTeamLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, logo: 'File size must be less than 5MB' }));
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, logo: 'Please select an image file' }));
        return;
      }

      setTeamLogo(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear any previous errors
      setErrors(prev => ({ ...prev, logo: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Team name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Team name must be at least 3 characters';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Team name must be less than 50 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Team description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // For now, create a mock team since we don't have the actual API
      // In real implementation, you would upload the logo and create the team via API
      const defaultTeamRank: TeamRank = {
        tier: 'bronze',
        division: 1,
        points: 0,
        pointsToNextRank: 100,
        season: '2024-1'
      };

      const mockTeam: Team = {
        id: `team_${Date.now()}`,
        name: formData.name,
        description: formData.description,
        logo: logoPreview || '/images/default-team-logo.png',
        members: [], // Will be populated with current user as captain
        captainId: 'current-user-id', // Would come from auth context
        isPrivate: formData.isPrivate,
        maxMembers: formData.maxMembers,
        teamRank: defaultTeamRank,
        achievements: [],
        sponsorshipStatus: 'not_available',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Here you would make the actual API call:
      // const response = await apiClient.teams.create(formData, teamLogo);
      // if (response.success) {
      //   onTeamCreated(response.data);
      // }

      // For demo purposes, just call the callback with mock data
      setTimeout(() => {
        onTeamCreated(mockTeam);
        setLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Failed to create team:', error);
      setErrors({ submit: 'Failed to create team. Please try again.' });
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h3 className="text-xl font-semibold text-white">Create New Team</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Team Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Team Logo
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 bg-slate-700 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center overflow-hidden">
                  {logoPreview ? (
                    <Image 
                      src={logoPreview} 
                      alt="Team logo preview" 
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <PhotoIcon className="w-8 h-8 text-slate-400" />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  {logoPreview ? 'Change Logo' : 'Upload Logo'}
                </button>
                <p className="text-xs text-slate-400 mt-1">
                  PNG, JPG up to 5MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </div>
            </div>
            {errors.logo && <p className="mt-1 text-sm text-red-400">{errors.logo}</p>}
          </div>

          {/* Team Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Team Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your team name"
              className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
            />
            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your team, playstyle, goals..."
              rows={3}
              className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent resize-none"
            />
            {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
          </div>

          {/* Team Size */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Maximum Team Size
            </label>
            <select
              name="maxMembers"
              value={formData.maxMembers}
              onChange={handleInputChange}
              className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
            >
              <option value={2}>2 Members</option>
              <option value={3}>3 Members</option>
              <option value={4}>4 Members</option>
              <option value={5}>5 Members</option>
              <option value={6}>6 Members</option>
              <option value={10}>10 Members</option>
            </select>
          </div>

          {/* Team Settings */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isPrivate"
                name="isPrivate"
                checked={formData.isPrivate}
                onChange={handleInputChange}
                className="w-4 h-4 text-gaming-600 bg-slate-700 border-slate-600 rounded focus:ring-gaming-500"
              />
              <label htmlFor="isPrivate" className="flex items-center text-sm text-slate-300">
                {formData.isPrivate ? (
                  <LockClosedIcon className="w-4 h-4 mr-2 text-red-400" />
                ) : (
                  <GlobeAltIcon className="w-4 h-4 mr-2 text-blue-400" />
                )}
                Private team (invite only)
              </label>
            </div>
          </div>

          {/* Submit Errors */}
          {errors.submit && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-400 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gaming-600 hover:bg-gaming-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
