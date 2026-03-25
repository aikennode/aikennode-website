import { useTheme } from "@/components/ThemeProvider";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme}
      position="top-right"
      richColors
      closeButton
      expand={false}
      gap={12}
      offset={{ top: 88, right: 24 }}
      mobileOffset={{ top: 72, right: 16 }}
      visibleToasts={4}
      duration={4500}
      pauseWhenPageIsHidden
      className="toaster group !z-[100]"
      toastOptions={{
        duration: 4500,
        classNames: {
          toast:
            "group toast !rounded-xl !border !p-4 !shadow-lg !backdrop-blur-md !bg-background/95 !text-foreground",
          title: "!text-sm !font-semibold !leading-snug",
          description: "!text-xs !text-muted-foreground !mt-1 !leading-relaxed",
          closeButton:
            "!border-border !bg-background/90 !opacity-80 hover:!opacity-100 hover:!bg-muted",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
