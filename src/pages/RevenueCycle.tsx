import { SecretaProductLayout } from "@/components/SecretaProductLayout";
import { useRevenueCycleContent } from "@/lib/revenueCycleContent";

export default function RevenueCycle() {
  const content = useRevenueCycleContent();
  return <SecretaProductLayout content={content} />;
}
