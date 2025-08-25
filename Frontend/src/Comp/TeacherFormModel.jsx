
import React, {
  useState,
  memo,
  useRef,
  useEffect,
} from "react";
import { X } from "lucide-react";

const TeacherFormModal = memo(({ teacher, onClose, onSave, isEdit }) => {
  const [formData, setFormData] = useState({
    fullName: teacher?.fullName || "",
    nameCode: teacher?.nameCode || "",
    email: teacher?.email || "",
    block: teacher?.block || "",
    password: "",
  });

  // Add state for the change options
  const [changeOptions, setChangeOptions] = useState({
    changeEmail: false,
    changePassword: false
  });

  const [errors, setErrors] = useState({});
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
    if (!formData.nameCode.trim()) newErrors.nameCode = "Code is required";
    
    // Only validate email if it's a new teacher or if changeEmail is checked
    if (!isEdit || changeOptions.changeEmail) {
      if (!formData.email.trim()) newErrors.email = "Email is required";
      if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }
    }
    
    // Only validate password if it's a new teacher or if changePassword is checked
    if ((!isEdit || changeOptions.changePassword) && !formData.password.trim()) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleChangeOptionToggle = (e) => {
    const { name, checked } = e.target;
    setChangeOptions(prev => ({
      ...prev,
      [name]: checked
    }));
    
    // Clear related error when toggling off
    if (!checked && errors[name.replace('change', '').toLowerCase()]) {
      setErrors(prev => ({
        ...prev,
        [name.replace('change', '').toLowerCase()]: null
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Create a copy of formData to modify before sending
      const submissionData = { ...formData };
      
      // If editing and not changing email/password, mark them appropriately
      if (isEdit) {
        submissionData.changeEmail = changeOptions.changeEmail;
        submissionData.changePassword = changeOptions.changePassword;
        
        // If not changing email, restore the original email
        if (!changeOptions.changeEmail) {
          submissionData.email = teacher.email;
        }
        
        // If not changing password, remove the password field
        if (!changeOptions.changePassword) {
          delete submissionData.password;
        }
      }
      
      onSave(submissionData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={modalRef} className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {isEdit ? "Edit Teacher" : "Add New Teacher"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code
            </label>
            <input
              type="text"
              name="nameCode"
              value={formData.nameCode}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.nameCode ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.nameCode && (
              <p className="mt-1 text-sm text-red-500">{errors.nameCode}</p>
            )}
          </div>
          
          {isEdit && (
            <div className="mb-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="changeEmail"
                  name="changeEmail"
                  checked={changeOptions.changeEmail}
                  onChange={handleChangeOptionToggle}
                  className="mr-2"
                />
                <label htmlFor="changeEmail" className="text-sm font-medium text-gray-700">
                  Change Email
                </label>
              </div>
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isEdit && !changeOptions.changeEmail}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.email ? "border-red-500" : "border-gray-300"
              } ${isEdit && !changeOptions.changeEmail ? "bg-gray-100" : ""}`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Block
            </label>
            <input
              type="text"
              name="block"
              value={formData.block}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          {isEdit && (
            <div className="mb-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="changePassword"
                  name="changePassword"
                  checked={changeOptions.changePassword}
                  onChange={handleChangeOptionToggle}
                  className="mr-2"
                />
                <label htmlFor="changePassword" className="text-sm font-medium text-gray-700">
                  Change Password
                </label>
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isEdit ? "New Password" : "Password"}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isEdit && !changeOptions.changePassword}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.password ? "border-red-500" : "border-gray-300"
              } ${isEdit && !changeOptions.changePassword ? "bg-gray-100" : ""}`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-gray-800 text-white rounded-md hover:bg-gray-700"
            >
              {isEdit ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default TeacherFormModal