import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, X, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const PhotoUploadPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to upload photos</p>
          <button
            onClick={() => navigate('/login')}
            className="btn bg-primary-500 text-white hover:bg-primary-600 px-8 py-3"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('Please select a photo to upload');
      return;
    }

    try {
      setIsUploading(true);

      // TODO: Implement actual photo upload API
      // For now, show a message
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate upload

      alert('Photo upload feature is coming soon! Your beautiful work will be showcased in our gallery.');
      navigate('/dashboard');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-purple/5 via-primary-100/10 to-purple/5 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple to-purple-dark text-white px-8 py-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <ImageIcon className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">Upload Your Photo</h1>
            <p className="text-white/90 text-lg">Share your amazing results and get votes!</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* File Upload Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Photo *
              </label>

              {!preview ? (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="mb-2 text-sm text-gray-600">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Caption */}
            <div>
              <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-2">
                Caption (optional)
              </label>
              <textarea
                id="caption"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent transition-all"
                placeholder="Tell us about your experience or the service..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                maxLength={500}
              />
              <p className="mt-1 text-sm text-gray-500">{caption.length}/500 characters</p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Photos with the most votes each week will be featured on our podium!
                Earn points and rewards for sharing your beautiful results.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isUploading || !selectedFile}
                className="flex-1 bg-gradient-to-r from-purple to-purple-dark text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Uploading...' : 'Upload Photo'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-8 bg-gray-200 text-gray-700 font-bold py-4 rounded-lg hover:bg-gray-300 transition-all"
              >
                Cancel
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
