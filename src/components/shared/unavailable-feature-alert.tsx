import { AlertTriangleIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface UnavailableFeatureAlertProps {
  title: string;
  description: string;
  requiredEndpoints?: string[];
}

export function UnavailableFeatureAlert({
  title,
  description,
  requiredEndpoints,
}: UnavailableFeatureAlertProps) {
  return (
    <Alert>
      <AlertTriangleIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <span>{description}</span>
        {requiredEndpoints?.length ? (
          <ul className="list-inside list-disc text-xs">
            {requiredEndpoints.map((endpoint) => (
              <li key={endpoint}>{endpoint}</li>
            ))}
          </ul>
        ) : null}
      </AlertDescription>
    </Alert>
  );
}
