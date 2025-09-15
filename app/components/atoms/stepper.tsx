interface StepperProps {
    step: number;
    totalSteps: number;
  }
  
  const Stepper: React.FC<StepperProps> = ({ step, totalSteps }) => {
    const percentage = Math.min((step / totalSteps) * 100, 100);
  
    return (
      <div className="w-full h-2 bg-gray-200  rounded-full overflow-hidden">
        <div
          className="h-full bg-[#283484] transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };
  
  export default Stepper;
  