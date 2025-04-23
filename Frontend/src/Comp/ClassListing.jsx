import React, { useState, useEffect } from "react";
import {
  Trash2,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import axiosInstance from '../Config/apiconfig'
import {  toast } from "react-toastify";
const ClassListing = () => {
  // Example initial data - will be replaced with API data later
  const initialClasses = [];

  // State management
  const [classes, setClasses] = useState(initialClasses);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClassData, setNewClassData] = useState({
    name: "",
    block: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const classesPerPage = 10;

  // Function to fetch classes from the API
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/classes/getAll`);
      const data = response.data;
  
      setClasses(data.result);
  
      // Use the API message if available, otherwise use a fallback
      if (data.message) {
        toast.success(data.message);
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.response?.data?.message || "Failed to get all classes");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchClasses();
  }, []);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    handleAddClass(newClassData);
    setShowAddModal(false);
    setNewClassData({ name: "", block: "" });
  };

  const handleDeleteClick = (id) => {
    console.log(id, "id received");
    localStorage.setItem("delete", id);
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteDialog(false);
    setLoading(true);
    const name = localStorage.getItem("delete");
  
    try {
      const response = await axiosInstance.delete(`/api/classes/delete`, {
        data: { name }, 
      });
  
      // Show toast success BEFORE fetching classes
      toast.success(response?.data?.message || "Class deleted successfully");
  
      await fetchClasses();
      setDeleteId(null);
    } catch (err) {
      setLoading(false);
      console.error("Error deleting class:", err);
  
      toast.error(err.response?.data?.message || "Error deleting class");
      // Fix toast error
    }
  };
  
  

  const handleAddClass = async (newClassData) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(`/api/classes/create`, newClassData);
      
      toast.success(response?.data?.message || "Successfully Added the Class"); 
      await fetchClasses();
    } catch (err) {
      setLoading(false);
      console.error("Error adding class:", err);
      
      // Fix toast error
      toast.error(err.response?.data?.message || "Failed to Add the Class");
    }
  };
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  const filteredClasses = classes.filter((cls) => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    return (
      cls.name?.toLowerCase().includes(lowerCaseSearch) ||
      cls.block?.toLowerCase().includes(lowerCaseSearch)
    );
  });
  

  const indexOfLastClass = currentPage * classesPerPage;
  const indexOfFirstClass = indexOfLastClass - classesPerPage;
  const currentClasses = filteredClasses.slice(
    indexOfFirstClass,
    indexOfLastClass
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredClasses.length / classesPerPage);
  return (
    <div className="container max-w-6xl min-h-screen mx-auto p-2 md:p-4">
      <div className="bg-white text-black shadow-md rounded-lg overflow-hidden">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center p-3 md:p-4 border-b gap-3 md:gap-0">
          <h2 className="text-xl text-black font-semibold">All Classes</h2>
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search..."
                className="w-full md:w-auto border pl-10 pr-3 py-2 rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <button
              onClick={handleAddClick}
              className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded hover:bg-gray-800 flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Class
            </button>
          </div>
        </div>

        {/* Responsive Table/Card View */}
        {isMobile ? (
          <div className="divide-y">
            {currentClasses.map((cls,idx) => (
              <div key={idx} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-sm text-gray-600">
                      Class: {cls.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      Block: {cls.block}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleDeleteClick(cls.name)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Class Name</th>
                  <th className="py-3 px-6 text-left">Block Name</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {currentClasses.map((cls, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-left">
                      <span>{cls.name}</span>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span>{cls.block}</span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center">
                        <button
                          onClick={() => handleDeleteClick(cls.name)}
                          className="w-4 px-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center md:justify-end items-center p-3 md:p-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="!bg-black px-3 md:px-4 py-2 text-sm md:text-base text-white border rounded disabled:opacity-50 flex items-center gap-1 hover:bg-blue-600"
            >
              <ChevronLeft className="h-4 w-4 text-white" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <span className="px-2 md:px-4 text-sm md:text-base">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="!bg-black px-3 md:px-4 py-2 text-sm md:text-base  text-white border rounded disabled:opacity-50 flex items-center gap-1 hover:bg-blue-600"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Dialog - Make it responsive */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-lg text-black font-semibold mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this class? This action cannot be
              undone.
            </p>
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="!bg-white px-4 py-2 text-gray-600 hover:text-gray-800 rounded flex items-center justify-center gap-2"
              >
                <X className="!bg-white h-4 w-4" /> Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="!bg-red px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center gap-2"
              >
                <Trash2 className="!bg-red h-4 w-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Class Modal - Make it responsive */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg text-black font-semibold">
                Add New Class
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="!bg-white text-gray-500 hover:text-gray-700"
              >
                <X className="!bg-white h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class Name
                  </label>
                  <input
                    type="text"
                    value={newClassData.name}
                    onChange={(e) =>
                      setNewClassData({ ...newClassData, name: e.target.value })
                    }
                    className="w-full text-black p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Block Name
                  </label>
                  <input
                    type="text"
                    value={newClassData.block}
                    onChange={(e) =>
                      setNewClassData({
                        ...newClassData,
                        block: e.target.value,
                      })
                    }
                    className="w-full text-black p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="!bg-white px-4 py-2 text-gray-600 hover:text-gray-800 rounded flex items-center justify-center gap-2"
                  >
                    <X className="!bg-white h-4 w-4" /> Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 !bg-black text-white rounded flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" /> Add Class
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassListing;
