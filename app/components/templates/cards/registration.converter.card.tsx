import React, { useState, useCallback } from "react";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../atoms/card";
import { Button } from "../../atoms/button";
import { RadioGroup, RadioGroupItem } from "../../atoms/radio-group";

import { Separator } from "../../atoms/separator";
import { Badge } from "../../atoms/badge";
import { Progress } from "../../atoms/progress";
import { Label } from "../../atoms/label";
import { userService } from "~/app/services/user.service";
import { authService } from "~/app/services/auth.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";

type DuplicateAction = "skip" | "overwrite" | "addAll";

interface ImportFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

interface ImportResults {
  files: {
    processed: number;
    records: number;
    validRecords: number;
  };
  users: {
    processed: number;
    successful: number;
    failed: number;
  };
  encounters: {
    processed: number;
    successful: number;
    failed: number;
  };
  successfulRegistrations: {
    firstName: string;
    lastName: string;
    email: string;
    transactionNo: string;
  }[];
  failedUserCreations: any[];
  failedEncounterCreations: any[];
}

export function RegistrationConverterCard() {
  const getUserData = getUserFromLocalStorage();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [duplicateAction, setDuplicateAction] =
    useState<DuplicateAction>("skip");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [results, setResults] = useState<ImportResults | null>(null);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      const allowedTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
        "application/json",
      ];

      if (
        allowedTypes.includes(file.type) ||
        file.name.endsWith(".xlsx") ||
        file.name.endsWith(".csv") ||
        file.name.endsWith(".json")
      ) {
        setSelectedFile(file); // keep the actual file
      } else {
        alert("Please select a valid file (.xlsx, .csv, or .json)");
      }
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileSelect(e.target.files);
    },
    [handleFileSelect]
  );

  const startImport = useCallback(async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProgress(0);
    setCurrentStep(3);

    try {
      const formData = new FormData();
      formData.append("files", selectedFile);
      formData.append("facilityId", getUserData?.user?.facilityId || "");
      formData.append("userId", getUserData?.user?.id || "");
      formData.append("origin", "Unknown");

      const res = await authService.bulkRegister(formData);

      setResults({
        files: res.summary.files,
        users: res.summary.users,
        encounters: res.summary.encounters,
        successfulRegistrations: res.data.successfulRegistrations,
        failedUserCreations: res.data.failedUserCreations,
        failedEncounterCreations: res.data.failedEncounterCreations,
      });

      setProgress(100);
      setIsProcessing(false);
      setCurrentStep(4); // ✅ success
    } catch (err) {
      console.error("Import failed:", err);
      setIsProcessing(false);
      setProgress(100);
      setCurrentStep(5); // ✅ failure
    }
  }, [selectedFile]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith(".xlsx")) return "📊";
    if (fileName.endsWith(".csv")) return "📋";
    if (fileName.endsWith(".json")) return "📄";
    return "📁";
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setSelectedFile(null);
    setDuplicateAction("skip");
    setIsProcessing(false);
    setProgress(0);
    setTimeRemaining(0);
    setResults(null);
  };

  return (
    <div className="max-w-4xl mx-auto ">
      <div className="flex justify-center mb-4">
        <div className="flex items-center gap-4">
          {[
            { step: 1, label: "Upload" },
            { step: 2, label: "Configure" },
            { step: 3, label: "Import" },
            { step: 4, label: "Done" },
          ].map(({ step, label }, index) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm transition-all duration-300 ${
                    currentStep === step
                      ? "bg-primary text-primary-foreground border-primary scale-105 shadow"
                      : currentStep > step
                      ? "bg-green-500 text-white border-green-500"
                      : "border-muted-foreground text-muted-foreground"
                  }`}
                >
                  {currentStep > step ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    step
                  )}
                </div>
                <span
                  className={`mt-1 text-xs ${
                    currentStep >= step
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </div>
              {index < 3 && (
                <div
                  className={`w-12 h-0.5 mx-2 ${
                    currentStep > step ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Upload File */}
      {currentStep === 1 && (
        <Card className="">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Step 1: Upload File
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="mb-2">
                Drag & drop your file here, or click to browse
              </p>
              <p className="text-sm text-muted-foreground">
                Supports .xlsx, .csv, and .json files
              </p>
              <input
                id="file-input"
                type="file"
                accept=".xlsx,.csv,.json"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>

            {selectedFile && (
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {getFileIcon(selectedFile.name)}
                    </span>
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(selectedFile.size)} •{" "}
                        {new Date(
                          selectedFile.lastModified
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                onClick={() => setCurrentStep(2)}
                disabled={!selectedFile}
              >
                Next: Configure Options
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Configure Import Options */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Configure Import Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="mb-4">Handle Duplicates</h3>
              <RadioGroup
                value={duplicateAction}
                onValueChange={(value) =>
                  setDuplicateAction(value as DuplicateAction)
                }
              >
                <div className="space-y-3 ">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="skip"
                      id="skip"
                      className="h-5 w-5 border-2 border-gray-400 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <Label className="flex-1 ">
                      <div>
                        <p>Skip (ignore)</p>
                        <p className="text-sm  text-muted-foreground">
                          Ignore duplicate records and keep existing data
                        </p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="overwrite"
                      id="overwrite"
                      className="h-5 w-5 border-2 border-gray-400 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <Label className="flex-1 ">
                      <div>
                        <p>Overwrite (replace)</p>
                        <p className="text-sm text-muted-foreground">
                          Replace existing records with new data
                        </p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="addAll"
                      id="addAll"
                      className="h-5 w-5 border-2 border-gray-400 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <Label className="flex-1 ">
                      <div>
                        <p>Add All (keep both)</p>
                        <p className="text-sm text-muted-foreground">
                          Import all records, including duplicates
                        </p>
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="mb-2">File Preview</h4>
              <div className="flex items-center gap-2 text-sm">
                <span>{getFileIcon(selectedFile?.name || "")}</span>
                <span>{selectedFile?.name}</span>
                <Badge variant="secondary">
                  {formatFileSize(selectedFile?.size || 0)}
                </Badge>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
              <Button onClick={startImport}>Start Import</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Convert & Import */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Convert & Import</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto">
                <div className="animate-spin w-16 h-16 border-4 border-muted border-t-primary rounded-full"></div>
              </div>
              <p>Processing your file...</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">File Status</p>
                <p>{isProcessing ? "Processing..." : "Complete"}</p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Time Remaining</p>
                <p>{timeRemaining}s</p>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4" />
                <span>Converting {selectedFile?.name}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Done! */}
      {currentStep === 4 && results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Step 4: Import Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted p-4 rounded-lg text-center">
                <p className="text-xl font-bold">{results.files.processed}</p>
                <p className="text-sm text-muted-foreground">Files Processed</p>
                <p className="text-xs text-muted-foreground">
                  {results.files.records} records ({results.files.validRecords}{" "}
                  valid)
                </p>
              </div>
              <div className="bg-muted p-4 rounded-lg text-center">
                <p className="text-xl font-bold text-green-600">
                  {results.users.successful}
                </p>
                <p className="text-sm text-muted-foreground">
                  Users Successful
                </p>
                <p className="text-xs text-muted-foreground">
                  {results.users.processed} processed, {results.users.failed}{" "}
                  failed
                </p>
              </div>
              <div className="bg-muted p-4 rounded-lg text-center">
                <p className="text-xl font-bold text-blue-600">
                  {results.encounters.successful}
                </p>
                <p className="text-sm text-muted-foreground">
                  Encounters Successful
                </p>
                <p className="text-xs text-muted-foreground">
                  {results.encounters.processed} processed,{" "}
                  {results.encounters.failed} failed
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={resetWizard}>
                Import Another File
              </Button>
              <Button>View Imported Records</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Failed */}
      {currentStep === 5 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Import Failed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Something went wrong while importing your file. Please try again.
            </p>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={resetWizard}>
                Try Again
              </Button>
              <Button
                variant="secondary"
                onClick={() => console.log("download error log")}
              >
                <Download className="w-4 h-4 mr-2" /> Download Error Log
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
