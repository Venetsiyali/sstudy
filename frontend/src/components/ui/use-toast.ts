// Minimal use-toast implementation
import * as React from "react"

export function useToast() {
    const [toasts, setToasts] = React.useState([])
    return {
        toasts,
        toast: (props: any) => setToasts((prev: any) => [...prev, props]),
        dismiss: (toastId?: string) => setToasts((prev: any) => prev.filter((toast: any) => toast.id !== toastId)),
    }
}
