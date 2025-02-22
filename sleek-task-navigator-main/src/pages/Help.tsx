
import { useEffect } from "react";

const Help = () => {
  useEffect(() => {
    window.location.href = "mailto:your.email@gmail.com";
  }, []);

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-muted-foreground">Redirecting you to our support email...</p>
      </div>
    </div>
  );
};

export default Help;
