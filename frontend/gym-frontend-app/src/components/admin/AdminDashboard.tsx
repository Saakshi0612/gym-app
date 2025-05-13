import { useState } from "react";
import DropdownField from "../common/Selection";
import Button from "../common/ButtonComponent";
import PeriodPickerWrapper from "../common/periodpicker";
import { ReportDataItem, filterReportData } from "./mockdata";

const AdminDashboard = () => {
  const [reportType, setReportType] = useState("All");
  const [gym, setGym] = useState("all");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState<ReportDataItem[]>([]);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReport = async () => {
    console.log("Report Type:", reportType);
    console.log("Gym:", gym);
    console.log("Start Date:", startDate?.toDateString());
    console.log("End Date:", endDate?.toDateString());
    
    setIsLoading(true);
    setShowReport(false);
    
    try {
      // Call the filter function from our mock data file
      const filteredData = await filterReportData(
        reportType,
        gym,
        startDate,
        endDate
      );
      
      setReportData(filteredData);
      setShowReport(true);
    } catch (error) {
      console.error("Error fetching report data:", error);
      // You could set an error state here to show an error message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Filters Section */}
      <div>
        <h2 className="text-sm font-medium text-gray-700 mb-3 tracking-wide uppercase">Filters</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Report Type */}
          <DropdownField
            label="Report Type"
            name="reportType"
            options={[
              { value: "coach performance", label: "Coach Performance" },
              { value: "sales statistics", label: "Sales Statistics" },
            ]}
            value={reportType}
            onChange={setReportType}
          />

          {/* Period Calendar Picker */}
          <PeriodPickerWrapper
            startDate={startDate}
            endDate={endDate}
            onChange={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
          />

          {/* Gym */}
          <DropdownField
            label="Gym"
            name="gym"
            options={[
              
              { value: "hrushevsky street,16,kyiv", label: "Hrushevsky Street, 16, Kyiv" },
              { value: "roosewelt street,83,kyiv", label: "Roosewelt Street, 83, Kyiv" },
              { value: "greyjoy manor,16,kyiv", label: "Greyjoy Manor, 16, Kyiv" },
            ]}
            value={gym}
            onChange={setGym}
          />

          {/* Generate Button */}
          <div className="flex items-end">
            <Button
              onClick={handleGenerateReport}
              fullWidth
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Generate Report"}
            </Button>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          <span className="ml-3 text-gray-600">Loading report data...</span>
        </div>
      )}

      {/* Report Table - Only shown after filtering and not loading */}
      {showReport && !isLoading && (
        <div className="mt-8">
          {reportData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No data found for the selected filters. Please try different criteria.
            </div>
          ) : (
            <>
              {/* Table with styling exactly matching the image */}
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-[#D9D9D9]">
                      <th className="py-3 px-4 text-left text-xs font-bold text-[#000000] border-b border-r border-gray-200">Gym Location</th>
                      <th className="py-3 px-4 text-left text-xs font-bold text-[#000000] border-b border-r border-gray-200">Coach Name</th>
                      <th className="py-3 px-4 text-left text-xs font-bold text-[#000000] border-b border-r border-gray-200">Email</th>
                      <th className="py-3 px-4 text-left text-xs font-bold text-[#000000] border-b border-r border-gray-200">Report Period (Start)</th>
                      <th className="py-3 px-4 text-left text-xs font-bold text-[#000000] border-b border-r border-gray-200">Report Period (End)</th>
                      <th className="py-3 px-4 text-left text-xs font-bold text-[#000000] border-b border-r border-gray-200">No. of Workouts</th>
                      <th className="py-3 px-4 text-left text-xs font-bold text-[#000000] border-b border-r border-gray-200">Workouts % Change (from previous period)</th>
                      <th className="py-3 px-4 text-left text-xs font-bold text-[#000000] border-b border-gray-200">Average Feedback(1-5)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((row, index) => (
                      <tr key={index} className="bg-white border-b border-gray-200">
                        <td className="py-3 px-4 text-sm text-gray-700 border-r border-gray-200">{row.gymLocation}</td>
                        <td className="py-3 px-4 text-sm text-gray-700 border-r border-gray-200">{row.coachName}</td>
                        <td className="py-3 px-4 text-sm text-gray-700 border-r border-gray-200">{row.email}</td>
                        <td className="py-3 px-4 text-sm text-gray-700 border-r border-gray-200">{row.periodStart}</td>
                        <td className="py-3 px-4 text-sm text-gray-700 border-r border-gray-200">{row.periodEnd}</td>
                        <td className="py-3 px-4 text-sm text-gray-700 border-r border-gray-200">{row.workouts}</td>
                        <td className={`py-3 px-4 text-sm border-r border-gray-200 ${row.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {row.change}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">{row.feedback}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Horizontal scrollbar indicator - green line exactly as in the image */}
              <div className="mt-4 flex  bg-gray-300 rounded-full">
  <div className="w-32 h-1.5 ml-[236px] bg-green-400 rounded-full"></div>
</div>

              {/* Export Button */}
              <div className="mt-4 flex justify-end relative">
                <button 
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  onClick={() => setShowExportOptions(!showExportOptions)}
                >
                  Export ▼
                </button>
                
                {showExportOptions && (
                  <div className="absolute right-0 mt-12 w-36 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                    <ul className="py-1">
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700">Export XLS</li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700">Export CSV</li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700">Export PDF</li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;