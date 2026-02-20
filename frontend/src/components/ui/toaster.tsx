import { ToastProvider, ToastViewport } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
    const { toasts } = useToast()

    return (
        <ToastProvider>
            {toasts.map(function ({ id, title, description, action, ...props }) {
                return (
                    // Placeholder for Toast Component if not generated yet.
                    // In a real scenario we'd need the full Toast component set.
                    // For now, returning null to avoid errors if Toast ui component is missing.
                    <div key={id} {...props} style={{ display: 'none' }}></div>
                )
            })}
            <ToastViewport />
        </ToastProvider>
    )
}
