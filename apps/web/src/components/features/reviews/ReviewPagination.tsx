interface ReviewPaginationProps {
  currentPage: number;
  totalPages: number;
  totalReviews: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function ReviewPagination({
  currentPage,
  totalPages,
  totalReviews,
  limit,
  onPageChange,
}: ReviewPaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalReviews);

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Précédent
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Suivant
        </button>
      </div>

      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Affichage de <span className="font-medium">{startItem}</span> à{' '}
            <span className="font-medium">{endItem}</span> sur{' '}
            <span className="font-medium">{totalReviews}</span> résultats
          </p>
        </div>

        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ←
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  page === currentPage
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              →
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
