import React, { useState, useCallback } from "react";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
  IdCard,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../atoms/card";
import { RadioGroup, RadioGroupItem } from "../../atoms/radio-group";
import { Button } from "../../atoms/button";
import { Separator } from "../../atoms/separator";
import { Progress } from "../../atoms/progress";
import { Label } from "../../atoms/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../atoms/select";

import { authService } from "~/app/services/auth.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";

type IdType = "philhealth_id" | "sss_id" | "umid" | "driver_license";
type DuplicateAction = "skip" | "overwrite" | "addAll";

export function RegistrationReaderCard() {
  const getUserData = getUserFromLocalStorage();
  const [duplicateAction, setDuplicateAction] =
    useState<DuplicateAction>("skip");
  const [currentStep, setCurrentStep] = useState(1);
  const [idType, setIdType] = useState<IdType>("philhealth_id");
  const [isFrontOnly, setIsFrontOnly] = useState(true);
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);

  /** handle file input */
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    side: "front" | "back"
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      side === "front" ? setFrontFile(file) : setBackFile(file);
    }
  };

  /** start OCR upload */
  const startOCR = useCallback(async () => {
    if (!frontFile) return;
    setIsProcessing(true);
    setProgress(0);
    setCurrentStep(3);
    try {
      const formData = new FormData();
      formData.append("files", frontFile);
      if (!isFrontOnly && backFile) {
        formData.append("files", backFile);
      }
      formData.append("facilityId", getUserData?.user?.facilityId || "");
      formData.append("isGenerate", "true");
      formData.append("type", idType);
      formData.append("issuer", "Unknown");
      formData.append("isFrontOnly", String(isFrontOnly));

      const res = await authService.upload(formData);

      setResults(res);
      setProgress(100);
      setIsProcessing(false);

      // if API returned error summary, decide step
      if (res?.summary?.failed > 0) {
        setCurrentStep(5); // show failure details
      } else {
        setCurrentStep(4); // success
      }
    } catch (err) {
      console.error("OCR failed:", err);
      setIsProcessing(false);
      setProgress(100);
      setCurrentStep(5);
    }
  }, [frontFile, backFile, idType, isFrontOnly]);

  const resetWizard = () => {
    setCurrentStep(1);
    setIdType("philhealth_id");
    setIsFrontOnly(true);
    setFrontFile(null);
    setBackFile(null);
    setProgress(0);
    setResults(null);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Steps progress bar */}
      <div className="flex justify-center mb-4">
        <div className="flex items-center gap-4">
          {[
            { step: 1, label: "Upload ID" },
            { step: 2, label: "Configure" },
            { step: 3, label: "Import" },
            { step: 4, label: "Done" },
          ].map(({ step, label }, index) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm transition-all ${
                    currentStep === step
                      ? "bg-primary text-white border-primary"
                      : currentStep > step
                      ? "bg-green-500 text-white border-green-500"
                      : "border-gray-400 text-gray-400"
                  }`}
                >
                  {currentStep > step ? <CheckCircle size={16} /> : step}
                </div>
                <span
                  className={`mt-1 text-xs ${
                    currentStep >= step ? "text-foreground" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>
              {index < 3 && (
                <div
                  className={`w-12 h-0.5 mx-2 ${
                    currentStep > step ? "bg-primary" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Upload */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IdCard size={20} /> Step 1: Choose ID & Upload
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dropdown ID Type */}
            <div>
              <h3 className="mb-2">Choose ID Type</h3>
              <Select
                value={idType}
                onValueChange={(v) => setIdType(v as IdType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select ID type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="philhealth_id">PhilHealth ID</SelectItem>
                  <SelectItem value="sss_id">SSS ID</SelectItem>
                  <SelectItem value="umid">UMID</SelectItem>
                  <SelectItem value="driver_license">
                    Driver's License
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* File Upload */}
            <div>
              <h3 className="mb-2">Upload ID Image</h3>
              <Label className="block mb-1">Front</Label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "front")}
              />
              {frontFile && (
                <img
                  src={URL.createObjectURL(frontFile)}
                  alt="Front preview"
                  className="mt-2 w-full max-h-48 object-contain rounded-lg border"
                />
              )}

              {!isFrontOnly && (
                <>
                  <Label className="block mt-3 mb-1">Back</Label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "back")}
                  />
                  {backFile && (
                    <img
                      src={URL.createObjectURL(backFile)}
                      alt="Back preview"
                      className="mt-2 w-full max-h-48 object-contain rounded-lg border"
                    />
                  )}
                </>
              )}
            </div>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setIsFrontOnly(!isFrontOnly)}
              >
                {isFrontOnly ? "Switch to Front & Back" : "Use Front Only"}
              </Button>
              <Button onClick={() => setCurrentStep(2)} disabled={!frontFile}>
                Next: Configure
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Configure */}
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

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
              <Button onClick={() => startOCR()}>Start Import</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Importing */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Importing</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto animate-spin border-4 border-gray-300 border-t-primary rounded-full"></div>
            <p>Processing OCR, please wait...</p>
            <Progress value={progress} />
          </CardContent>
        </Card>
      )}

      {/* Step 4: Done (Success) */}
      {currentStep === 4 && results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="text-green-600" /> Step 4: Done!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">{results?.message}</p>

            {/* Summary */}
            <div className="bg-gray-50 p-3 rounded text-sm">
              <p>Total: {results?.summary?.total}</p>
              <p>Successful: {results?.summary?.successful}</p>
              <p>Failed: {results?.summary?.failed}</p>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={resetWizard}>
                Upload Another
              </Button>
              <Button>Use Extracted Data</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Failed (with details) */}
      {currentStep === 5 && results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle size={20} /> Import Issues
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Some files failed to process:
            </p>

            {/* Failed list */}
            <div className="bg-red-50 p-3 rounded text-sm space-y-2">
              {results?.data?.failed?.map((f: any, idx: number) => (
                <div key={idx} className="border-b pb-2 last:border-0">
                  <p>
                    <b>{f.filename}</b> – {f.error}
                  </p>
                  {f.extractedData && (
                    <pre className="text-xs bg-white p-2 rounded mt-1 overflow-auto">
                      {JSON.stringify(f.extractedData, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={resetWizard}>
                Try Again
              </Button>
              <Button variant="secondary">
                <Download className="w-4 h-4 mr-2" /> Download Error Log
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
