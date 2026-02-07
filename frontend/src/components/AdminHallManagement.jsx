import React, { useState } from 'react';
import { apiFetch } from '../lib/api';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

const AdminHallManagement = ({ hall, onUpdate, isSidebarVisible }) => {
  const [isAvailable, setIsAvailable] = useState(hall.isAvailable);
  const [reason, setReason] = useState(hall.unavailabilityReason || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await apiFetch(`/api/seminar-halls/${hall._id}/availability`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isAvailable,
          unavailabilityReason: !isAvailable ? reason : ''
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update hall availability');
      }

      const data = await response.json();
      setSuccess('Banquet hall availability updated successfully');
      
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
      
      onUpdate(data.hall);
    } catch (err) {
      setError(err.message || 'Error updating availability');
      
      // Auto-dismiss error message after 5 seconds
      setTimeout(() => {
        setError('');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-100 
      shadow-md hover:shadow-xl p-6 transition-all duration-300 ease-out hover:border-[#9B1A33]/20">
      <div className="transition-all duration-300">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex-1">
          <h3 className="text-base font-bold text-gray-900 mb-1">Manage Availability</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Control booking availability for this banquet hall
          </p>
        </div>
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border-2 
            transition-all duration-200 ${
            isAvailable
              ? 'bg-green-50 text-green-700 border-green-300 shadow-sm'
              : 'bg-red-50 text-red-700 border-red-300 shadow-sm'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
          {isAvailable ? 'Available' : 'Unavailable'}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Availability Toggle */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Availability Status
          </label>
          <div className="flex gap-2 w-full rounded-xl border-2 border-gray-200 bg-gray-50 p-1.5 shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setIsAvailable(true)}
              className={`flex min-w-0 px-4 py-2.5 rounded-lg transition-all duration-200 ease-out 
                items-center justify-center font-medium text-xs ${
                isAvailable
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                  : 'bg-green-600 text-white hover:bg-green-800 hover:text-white'
              }`}
            >
              Available
            </button>
            <button
              type="button"
              onClick={() => setIsAvailable(false)}
              className={`flex min-w-0 px-4 py-2.5 rounded-lg transition-all duration-200 ease-out 
                items-center justify-center font-medium text-xs ${
                !isAvailable
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md'
                  : 'bg-red-600 text-white hover:bg-red-800 hover:text-white'
              }`}
            >
              Unavailable
            </button>
          </div>
        </div>

        {/* Reason Input - Smooth Transition */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
          !isAvailable ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-700">
                Reason for Unavailability
              </label>
              <span className="text-xs text-gray-400 italic">Required field</span>
            </div>
            <div className="relative">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required={!isAvailable}
                className="w-full min-h-[90px] p-4 border-2 border-gray-200 rounded-xl text-sm 
                  focus:ring-2 focus:ring-[#9B1A33]/50 focus:border-[#9B1A33] outline-none resize-none 
                  placeholder:text-gray-400 transition-all duration-200 bg-white
                  hover:border-gray-300"
                rows="3"
                placeholder="e.g., Under maintenance until Dec 1st, Reserved for private event, Renovation in progress..."
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                {reason.length}/200
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-3 text-sm text-red-700 bg-red-50 border-2 border-red-200 
            rounded-xl px-4 py-3 animate-[slideDown_0.3s_ease-out]">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="flex items-start gap-3 text-sm text-green-700 bg-green-50 border-2 border-green-200 
            rounded-xl px-4 py-3 animate-[slideDown_0.3s_ease-out]">
            <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" />
            <span className="flex-1">{success}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full inline-flex justify-center items-center gap-2 px-5 py-3.5 rounded-xl 
              text-sm font-semibold bg-gradient-to-r from-[#9B1A33] to-[#6f1024] text-white 
              hover:from-[#7f152a] hover:to-[#5a0d1d] transition-all duration-200 ease-out 
              shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0
              ${isSubmitting ? 'opacity-60 cursor-not-allowed hover:transform-none' : ''}`}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Updating Availability...</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                <span>Update Availability Status</span>
              </>
            )}
          </button>
        </div>
      </form>
      </div>

      {/* Custom Animations for slideDown */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminHallManagement;