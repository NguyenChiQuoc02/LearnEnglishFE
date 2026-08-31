"use client";

import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";

export type ProcessStep = {
  key: string;
  label: string;
};

export default function ProcessStepper({
  steps,
  activeIndex,
  error = false,
}: {
  steps: ProcessStep[];
  /** Index of the step currently in progress; steps before it are shown as completed. */
  activeIndex: number;
  /** Marks the active step as failed instead of in-progress/completed. */
  error?: boolean;
}) {
  return (
    <Stepper activeStep={activeIndex} alternativeLabel>
      {steps.map((step) => (
        <Step key={step.key}>
          <StepLabel error={error}>{step.label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
