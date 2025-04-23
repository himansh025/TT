import React, { useState, useRef, useEffect, useCallback, useMemo, memo, forwardRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

// Memoized option item component
const SelectOption = memo(({ 
  option, 
  isSelected, 
  onSelect, 
  id 
}) => {
  const handleClick = useCallback(() => {
    onSelect(option);
  }, [option, onSelect]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(option);
    }
  }, [option, onSelect]);

  return (
    <li
      id={`${id}-option-${option.value}`}
      role="option"
      aria-selected={isSelected}
      tabIndex={-1}
      className={`
        flex items-center px-4 py-2 cursor-pointer
        ${isSelected ? 'bg-blue-100 text-blue-900' : 'text-gray-900'}
        hover:bg-gray-100 hover:text-blue-700
        active:bg-blue-100
        group
        transition-colors duration-150 ease-in-out
      `}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <span className="flex-grow truncate group-hover:font-medium">{option.label}</span>
      {isSelected ? (
        <Check className="h-5 w-5 text-blue-600 ml-2" aria-hidden="true" />
      ) : (
        <span className="h-5 w-5 ml-2 opacity-0 group-hover:opacity-30 transition-opacity">
          <Check className="h-5 w-5 text-gray-500" aria-hidden="true" />
        </span>
      )}
    </li>
  );
});

// Main select component
const CustomSelect = forwardRef(({
  id,
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  error,
  position = 'bottom', // Can be 'bottom', 'top', 'auto'
  className = '',
  optionsClassName = '',
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const selectRef = useRef(null);
  const optionsRef = useRef(null);
  
  // Memoize options to prevent unnecessary re-renders
  const memoizedOptions = useMemo(() => options, [JSON.stringify(options)]);
  
  // Find and set selected option when value changes (memoized)
  useEffect(() => {
    if (value !== undefined) {
      const option = memoizedOptions.find(opt => opt.value === value);
      setSelectedOption(option || null);
    }
  }, [value, memoizedOptions]);

  // Handle outside clicks (memoized handler)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Memoized position calculation
  const getDropdownPosition = useCallback(() => {
    if (!optionsRef.current || !selectRef.current || position !== 'auto') return position;
    
    const selectRect = selectRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const spaceBelow = windowHeight - selectRect.bottom;
    const optionsHeight = optionsRef.current.offsetHeight;
    
    return spaceBelow < optionsHeight && selectRect.top > optionsHeight ? 'top' : 'bottom';
  }, [position]);

  const toggleDropdown = useCallback(() => {
    if (!disabled) {
      setIsOpen(prev => !prev);
    }
  }, [disabled]);

  const handleSelect = useCallback((option) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onChange) {
      onChange(option.value);
    }
  }, [onChange]);

  const handleKeyDown = useCallback((e) => {
    if (disabled) return;
    
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        toggleDropdown();
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      case 'ArrowDown':
        if (!isOpen) {
          setIsOpen(true);
        } else if (selectedOption) {
          e.preventDefault();
          const currentIndex = memoizedOptions.findIndex(opt => opt.value === selectedOption.value);
          const nextIndex = (currentIndex + 1) % memoizedOptions.length;
          handleSelect(memoizedOptions[nextIndex]);
        } else if (memoizedOptions.length > 0) {
          e.preventDefault();
          handleSelect(memoizedOptions[0]);
        }
        break;
      case 'ArrowUp':
        if (!isOpen) {
          setIsOpen(true);
        } else if (selectedOption) {
          e.preventDefault();
          const currentIndex = memoizedOptions.findIndex(opt => opt.value === selectedOption.value);
          const prevIndex = (currentIndex - 1 + memoizedOptions.length) % memoizedOptions.length;
          handleSelect(memoizedOptions[prevIndex]);
        } else if (memoizedOptions.length > 0) {
          e.preventDefault();
          handleSelect(memoizedOptions[memoizedOptions.length - 1]);
        }
        break;
      default:
        break;
    }
  }, [disabled, isOpen, selectedOption, memoizedOptions, toggleDropdown, handleSelect]);

  const dropdownPosition = getDropdownPosition();
  
  // Memoize button classes for performance
  const buttonClasses = useMemo(() => `
    flex items-center justify-between w-full px-4 py-2 
    bg-white border rounded-md shadow-sm
    ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'cursor-pointer hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'}
    ${error ? 'border-red-500' : 'border-gray-300'}
    ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
    transition-all duration-150 ease-in-out
    hover:shadow-md
  `, [disabled, error, isOpen]);

  // Memoize dropdown classes for performance
  const dropdownClasses = useMemo(() => `
    absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg 
    max-h-60 overflow-auto focus:outline-none
    ${dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'}
    transform transition-transform duration-150 ease-out
    ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
    ${optionsClassName}
  `, [dropdownPosition, isOpen, optionsClassName]);
  
  return (
    <div className={`relative w-full ${className}`} ref={selectRef}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      
      <div
        ref={ref}
        id={id}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${id}-options`}
        aria-labelledby={label ? `${id}-label` : undefined}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        className={buttonClasses}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
      >
        <span className={`block truncate ${!selectedOption ? 'text-gray-500' : 'text-gray-900'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={`h-5 w-5 text-gray-400 transition-transform duration-150 ${isOpen ? 'transform rotate-180' : ''}`} 
          aria-hidden="true"
        />
      </div>
      
      <div
        ref={optionsRef}
        id={`${id}-options`}
        role="listbox"
        aria-labelledby={label ? `${id}-label` : undefined}
        className={dropdownClasses}
        tabIndex={-1}
      >
        <ul className="py-1">
          {memoizedOptions.length > 0 ? (
            memoizedOptions.map((option) => (
              <SelectOption 
                key={option.value}
                option={option}
                isSelected={selectedOption?.value === option.value}
                onSelect={handleSelect}
                id={id}
              />
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500 italic">No options available</li>
          )}
        </ul>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

// Memoize the entire component for optimal performance
const MemoizedCustomSelect = memo(CustomSelect);

// Example usage component
// const SelectExample = () => {
//   const [value, setValue] = useState('');
  
//   const options = useMemo(() => [
//     { value: 'et-block', label: 'ET-Block' },
//     { value: 'option-2', label: 'Option 2' },
//     { value: 'option-3', label: 'Option 3' },
//     { value: 'option-4', label: 'Option 4' },
//   ], []);
  
//   const handleChange = useCallback((newValue) => {
//     setValue(newValue);
//   }, []);
  
//   return (
//     <div className="p-6 max-w-md mx-auto">
//       <MemoizedCustomSelect
//         id="example-select"
//         label="Select Component"
//         options={options}
//         value={value}
//         onChange={handleChange}
//         placeholder="ET-Block"
//         position="auto"
//       />
//       <p className="mt-4 text-sm text-gray-500">Selected value: {value || 'None'}</p>
//     </div>
//   );
// };

// export default SelectExample;
export default MemoizedCustomSelect;