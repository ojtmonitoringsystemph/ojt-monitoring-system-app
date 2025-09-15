import { useState } from "react";
import PageLayout from "@/components/templates/layout/page.layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { BarChart3, Download, FileText, TrendingUp } from "lucide-react";
import { type PageProps } from "@/types/page.type";

const Reports = ({ userRole, userName, onLogout }: PageProps) => {
  const [reportType, setReportType] = useState("");
  const [timeframe, setTimeframe] = useState("");

  const reportTypes = [
    { value: "student-progress", label: "Student Progress Report" },
    { value: "task-completion", label: "Task Completion Report" },
    { value: "organization-summary", label: "Organization Summary" },
    { value: "attendance", label: "Attendance Report" },
  ];

  const timeframes = [
    { value: "weekly", label: "This Week" },
    { value: "monthly", label: "This Month" },
    { value: "quarterly", label: "This Quarter" },
    { value: "yearly", label: "This Year" },
  ];

  const sampleData = {
    "student-progress": {
      title: "Student Progress Overview",
      data: [
        { metric: "Total Students", value: 25, change: "+5%" },
        { metric: "Completed Tasks", value: 142, change: "+12%" },
        { metric: "Pending Tasks", value: 28, change: "-8%" },
        { metric: "Average Progress", value: "78%", change: "+3%" },
      ],
    },
    "task-completion": {
      title: "Task Completion Analysis",
      data: [
        { metric: "Tasks Created", value: 45, change: "+15%" },
        { metric: "Tasks Completed", value: 38, change: "+20%" },
        { metric: "Overdue Tasks", value: 3, change: "-50%" },
        { metric: "Completion Rate", value: "84%", change: "+5%" },
      ],
    },
  };

  const generateReport = () => {
    console.log("Generating report:", { reportType, timeframe });
  };

  return (
    <PageLayout userRole={userRole} userName={userName} onLogout={onLogout}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Reports</h1>
              <p className="text-muted-foreground">
                Generate and view student progress reports
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Generate Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Report Type
                </label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Timeframe
                </label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeframes.map((frame) => (
                      <SelectItem key={frame.value} value={frame.value}>
                        {frame.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={generateReport}
                  disabled={!reportType || !timeframe}
                  className="w-full"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {reportType && sampleData[reportType as keyof typeof sampleData] && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                {sampleData[reportType as keyof typeof sampleData].title}
              </CardTitle>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {sampleData[reportType as keyof typeof sampleData].data.map(
                  (item, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          {item.metric}
                        </span>
                        <span
                          className={`text-xs flex items-center gap-1 ${
                            item.change.startsWith("+")
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <TrendingUp className="h-3 w-3" />
                          {item.change}
                        </span>
                      </div>
                      <div className="text-2xl font-bold">{item.value}</div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
};

export default Reports;
