import React, { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';

const SeminarHallFilters = ({ seminarHalls, onFilterChange }) => {
  const [filters, setFilters] = useState({
    capacity: '',
    equipment: []
  });
  const [availableEquipment, setAvailableEquipment] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const equipmentSet = new Set();
    seminarHalls.forEach(hall => {
      hall.equipment.forEach(item => {
        equipmentSet.add(item.name);
      });
    });
    setAvailableEquipment(Array.from(equipmentSet));
  }, [seminarHalls]);

  const handleCapacityChange = (e) => {
    const newFilters = {
      ...filters,
      capacity: e.target.value
    };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleEquipmentChange = (equipment) => {
    const newEquipment = filters.equipment.includes(equipment)
      ? filters.equipment.filter(item => item !== equipment)
      : [...filters.equipment, equipment];
    
    const newFilters = {
      ...filters,
      equipment: newEquipment
    };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (currentFilters) => {
    const filteredHalls = seminarHalls.filter(hall => {
      if (currentFilters.capacity && hall.capacity < parseInt(currentFilters.capacity)) {
        return false;
      }

      if (currentFilters.equipment.length > 0) {
        const hallEquipmentNames = hall.equipment.map(eq => eq.name);
        return currentFilters.equipment.every(eq => hallEquipmentNames.includes(eq));
      }

      return true;
    });

    onFilterChange(filteredHalls);
  };

  const clearFilters = () => {
    const newFilters = {
      capacity: '',
      equipment: []
    };
    setFilters(newFilters);
    onFilterChange(seminarHalls);
  };

  return (
    <div className="relative">
      {/* Filter Button - Always visible */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center space-x-2 px-4 py-2 rounded-xl 
          bg-gradient-to-r from-[#9B1A33] to-[#6f1024] text-white 
          hover:from-[#7f152a] hover:to-[#5a0d1d] transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
      >
        <Filter size={20} />
        <span>Filters</span>
        {(filters.capacity || filters.equipment.length > 0) && (
          <span className="ml-2 bg-white text-[#9B1A33] px-2 py-1 rounded-full text-sm">
            {filters.equipment.length + (filters.capacity ? 1 : 0)}
          </span>
        )}
      </button>

      {/* Filter Panel - Popup */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-end z-50">
          <div className="w-96 h-full bg-white shadow-2xl p-6 overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Filter Halls</h3>
              <button 
                onClick={() => setShowFilters(false)}
                className="items-center w-20 space-x-2 px-4 py-2 rounded-xl 
                      bg-gradient-to-r from-[#9B1A33] to-[#6f1024] text-white 
                    hover:from-[#7f152a] hover:to-[#5a0d1d] transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                Close
              </button>
            </div>

            {/* Filter Content */}
            <div className="space-y-6">
              {/* Capacity Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Seating Capacity
                </label>
                <input
                  type="number"
                  value={filters.capacity}
                  onChange={handleCapacityChange}
                  min="0"
                  placeholder="Enter minimum capacity"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9B1A33] focus:border-[#9B1A33]"
                />
              </div>

              {/* Equipment Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Equipment
                </label>
                <div className="space-y-2">
                  {availableEquipment.map((equipment) => (
                    <label
                      key={equipment}
                      className="flex items-center justify-between w-full text-sm p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                    >
                      <span className="text-gray-700">{equipment}</span>
                      <input
                        type="checkbox"
                        checked={filters.equipment.includes(equipment)}
                        onChange={() => handleEquipmentChange(equipment)}
                        className="h-4 w-4 rounded border-gray-300 text-[#9B1A33] focus:ring-[#6f1024] ml-2"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(filters.capacity || filters.equipment.length > 0) && (
                <button
                  onClick={clearFilters}
                  className="items-center w-full space-x-2 px-4 py-2 rounded-xl 
                      bg-gradient-to-r from-[#9B1A33] to-[#6f1024] text-white 
                    hover:from-[#7f152a] hover:to-[#5a0d1d] transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeminarHallFilters;