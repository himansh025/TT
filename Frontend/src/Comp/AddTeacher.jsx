
import React, {
  useState,
  useCallback,
  useMemo,
  memo,
  useRef,
  useEffect,
} from "react";
import { toast } from "react-toastify";
import { Trash2, Edit, ChevronDown, X } from "lucide-react";
import Pagination from "./Pagination";
import axiosInstance from "../Config/apiconfig.js";
import TeacherFormModal from './TeacherFormModel.jsx'
import ConfirmationModal from './ConfirmationModal.jsx'


// Custom Sort Component
const SortDropdown = memo(({ options, value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = useCallback(
    (option) => {
      onChange(option);
      setIsOpen(false);
    },
    [onChange]
  );

  return (
    <div className="relative inline-block text-left" ref={selectRef}>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-600">{label}</span>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-1 px-1 py-1 text-sm font-medium text-gray-700 bg-white rounded hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
          onClick={toggleDropdown}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="font-medium">{value}</span>
          <ChevronDown className="w-4 h-4 text-gray-500" aria-hidden="true" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-1 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {options.map((option) => (
              <button
                key={option}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${option === value
                    ? "bg-gray-50 text-blue-600 font-medium"
                    : "text-gray-700"
                  }`}
                onClick={() => handleSelect(option)}
                role="menuitem"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});


const sortOptions = ["Newest", "Oldest", "Name A-Z", "Name Z-A"];

// Main Teachers Layout Component
const TeachersLayout = () => {
  const [teachers, setTeachers] = useState([]);
  const [sortOption, setSortOption] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const paginationDetails = useMemo(() => {
    const totalItems = teachers.length;
    const itemsPerPage = 8;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return { totalItems, totalPages, itemsPerPage }
  }, [teachers]);

  const sortedTeachers = useMemo(() => {
    const sorted = [...teachers];

    switch (sortOption) {
      case "Newest":
        return sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      case "Oldest":
        return sorted.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
      case "Name A-Z":
        return sorted.sort((a, b) => a.fullName.localeCompare(b.fullName));
      case "Name Z-A":
        return sorted.sort((a, b) => b.fullName.localeCompare(a.fullName));
      default:
        return sorted;
    }
  }, [teachers, sortOption]);

  const paginationContentStartIndex = (currentPage - 1) * paginationDetails.itemsPerPage;
  const filteredTeachers = sortedTeachers.slice(
    paginationContentStartIndex,
    paginationContentStartIndex + paginationDetails.itemsPerPage
  );

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleSortChange = useCallback((option) => {
    setSortOption(option);
  }, []);

  // Function to fetch teachers from the API - similar to fetchClasses in ClassListing
  const fetchTeachers = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/api/teachers/getAll`);
      const data = await response.data;
      console.log(data);
      setTeachers(data.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Handler for opening the add teacher modal
  const handleAddClick = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  // Handler for opening the edit teacher modal
  const handleEdit = useCallback((teacher) => {
    setCurrentTeacher(teacher);
    setIsEditModalOpen(true);
  }, []);

  // Handler for opening the delete confirmation modal
  const handleDeleteClick = useCallback((teacherData) => {
    console.log("id check", teacherData);

    const teacherToDelete = teachers.find(teacher => teacher.email === teacherData.email);
    console.log("techer check", teacherToDelete);
    setCurrentTeacher(teacherToDelete);
    setDeleteId(teacherData.email);
    localStorage.setItem("deleteTeacher", teacherData.email); // Similar to ClassListing approach
    setIsDeleteModalOpen(true);
  }, [teachers]);


  // Handler for saving a new teacher - similar to handleAddClass in ClassListing
  const handleAddSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(`/api/teachers/register`, formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(response?.data?.message || "Teacher added successfully");
      await fetchTeachers();
      setIsAddModalOpen(false);
    } catch (err) {
      setIsLoading(false);
      toast.error(err?.response?.data?.message || "Error adding teacher");
      console.error("Error adding teacher:", err.response?.data || err.message);
    }
  };

  // Handler for updating an existing teacher
  const handleEditSubmit = async (formData) => {
    try {
      setIsLoading(true);
      // Create a copy of the form data for updates
      const updates = { ...formData };
      const existingEmail = currentTeacher.email;

      // Handle password - remove if empty (unchanged)
      if (!updates.password || !updates.password.trim()) {
        delete updates.password;
      }

      // Handle email - if it's unchanged (same as current), mark it for the backend
      if (updates.email === existingEmail) {
        updates.emailUnchanged = true;
      }

      const response = await axiosInstance.put(`/api/teachers/update`, JSON.stringify({
        existingEmail,
        updates
      }));
      toast.success("Teacher updated successfully")
      await fetchTeachers();
      setIsEditModalOpen(false);

    } catch (err) {
      setIsLoading(false);
      toast.error(err?.response?.data?.message || "Error Update Teacher");
      console.error("Error adding teacher:", err.response?.data || err.message);
    }
  };
  // Handler for deleting a teacher - similar to handleDeleteConfirm in ClassListing
  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    const email = currentTeacher.email;
    setIsDeleteModalOpen(false);

    try {
      const response = await axiosInstance.delete(`/api/teachers/delete`, {
        data: { email },  // Send data in "data" property for DELETE request
      });

      if (response.data) {
        await fetchTeachers();
        toast.success(response?.data?.message || " Deleting teacher Successfully");
        setDeleteId(null);
      }
    } catch (err) {
      setIsLoading(false);
      toast.error(err?.response?.data?.message || "Error Deleting teacher");
      console.error("Error deleting teacher:", err.response?.data || err.message);
    }
  };


  return (
    <div className="max-w-6xl mx-auto p-4 flex flex-col min-h-[90vh] h-fit">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Teachers</h1>
          <div className="text-sm text-green-500 font-medium">
            Active Teachers
          </div>
        </div>
        <button
          onClick={handleAddClick}
          className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          Add Teacher
        </button>
      </div>

      <div className="mb-6">
        <SortDropdown
          label="Sort by"
          options={sortOptions}
          value={sortOption}
          onChange={handleSortChange}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teacher Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Edit
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remove
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y min-w-[320px] divide-gray-200">
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {teacher.fullName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {teacher.nameCode}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{teacher.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleEdit(teacher)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleDeleteClick(teacher)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No teachers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-auto">
        <Pagination
          currentPage={currentPage}
          totalPages={paginationDetails.totalPages}
          onPageChange={handlePageChange}
          showPageNumbers={true}
          edgePageCount={1}
          middlePageCount={3}
          showDots={true}
          totalItems={paginationDetails.totalItems}
          itemsPerPage={paginationDetails.itemsPerPage}
          showItemsInfo={true}
        />
      </div>

      {/* Add Teacher Modal */}
      {isAddModalOpen && (
        <TeacherFormModal
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddSubmit}
          isEdit={false}
        />
      )}

      {/* Edit Teacher Modal */}
      {isEditModalOpen && currentTeacher && (
        <TeacherFormModal
          teacher={currentTeacher}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEditSubmit}
          isEdit={true}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentTeacher && (
        <ConfirmationModal
          teacherName={currentTeacher.fullName}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default TeachersLayout;
