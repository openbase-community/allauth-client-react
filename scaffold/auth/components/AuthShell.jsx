import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthShell({
  title,
  description,
  children,
  footer = null,
  maxWidth = "max-w-md",
}) {
  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:py-16">
      <div className={`mx-auto w-full ${maxWidth}`}>
        <Card className="border-border/70 shadow-sm">
          <CardHeader className="space-y-2">
            <CardTitle>{title}</CardTitle>
            {description ? (
              <CardDescription className="text-sm leading-6">
                {description}
              </CardDescription>
            ) : null}
          </CardHeader>
          <CardContent className="space-y-6">{children}</CardContent>
        </Card>
        {footer ? (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function AuthDivider({ label = "Or continue with" }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-[11px] uppercase tracking-[0.18em]">
        <span className="bg-card px-3 text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}
