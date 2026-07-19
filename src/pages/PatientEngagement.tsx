import { SecretaProductLayout } from "@/components/SecretaProductLayout";
import { usePatientEngagementContent } from "@/lib/patientEngagementContent";

export default function PatientEngagement() {
  const content = usePatientEngagementContent();
  return <SecretaProductLayout content={content} />;
}
