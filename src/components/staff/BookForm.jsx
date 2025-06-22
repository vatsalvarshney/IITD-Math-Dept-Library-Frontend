import React from 'react';
import { getTags, addTag } from '../../api/books';

const BookForm = ({ onSubmit, isSubmitting, initialData = null }) => {
  const [formData, setFormData] = React.useState({
    isbn: '',
    title: '',
    author: '',
    description: '',
    shelf: '',
    rack: '',
    total_quantity: 1,
    tags: [],
    ...initialData,
  });
  const [availableTags, setAvailableTags] = React.useState([]);
  const [newTag, setNewTag] = React.useState('');

  React.useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await getTags();
        setAvailableTags(response.data);
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      }
    };
    fetchTags();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagChange = (tagId) => {
    setFormData((prev) => {
      const tags = prev.tags.includes(tagId)
        ? prev.tags.filter((id) => id !== tagId)
        : [...prev.tags, tagId];
      return { ...prev, tags };
    });
  };

  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTag.trim()) return;

    try {
      const response = await addTag({ name: newTag.trim() });
      setAvailableTags((prev) => [...prev, response.data]);
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, response.data.id],
      }));
      setNewTag('');
    } catch (error) {
      console.error('Failed to add new tag:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">ISBN*</label>
        <input
          type="text"
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
          // required
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary p-2 max-w-xs"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Title*</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Author*</label>
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Total Quantity*
        </label>
        <input
          type="number"
          name="total_quantity"
          value={formData.total_quantity}
          onChange={handleChange}
          min="0"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary p-2 max-w-xs"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Shelf</label>
        <input
          type="text"
          name="shelf"
          value={formData.shelf}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary p-2 max-w-xs"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Rack</label>
        <input
          type="text"
          name="rack"
          value={formData.rack}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary p-2 max-w-xs"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="space-y-2">
          {availableTags.map((tag) => (
            <label key={tag._id} className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                checked={formData.tags.includes(tag._id)}
                onChange={() => handleTagChange(tag._id)}
                className="rounded border border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">{tag.name}</span>
            </label>
          ))}
        </div>
        <div className="mt-2 flex">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add new tag"
            className="flex-1 rounded-l-md border border-gray-300 focus:border-primary focus:ring-primary p-2 max-w-xs"
          />
          <button
            onClick={handleAddTag}
            type="button"
            className="rounded-r-md border border-l-0 border-gray-300 px-4 py-2 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Add
          </button>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Book' : 'Add Book'}
        </button>
      </div>
    </form>
  );
};

export default BookForm;