import { PrinterIcon } from '@heroicons/react/24/outline';

interface PrintButtonProps {
  documentTitle?: string;
  className?: string;
}

export default function PrintButton({ documentTitle, className = '' }: PrintButtonProps) {
  const handlePrint = () => {
    const originalTitle = document.title;

    // 設定列印文件標題
    if (documentTitle) {
      document.title = documentTitle;
    }

    // 執行列印
    window.print();

    // 還原原始標題
    document.title = originalTitle;
  };

  return (
    <button
      onClick={handlePrint}
      className={`no-print inline-flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${className}`}
      aria-label="列印課表"
    >
      <PrinterIcon className="h-5 w-5" />
      <span className="font-medium">列印課表</span>
    </button>
  );
}
