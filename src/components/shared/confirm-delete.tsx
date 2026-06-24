import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ConfirmDeleteProps {
  title: string
  description: string
  onConfirm: () => void | Promise<void>
  trigger: React.ReactElement
  destructiveLabel?: string
}

export function ConfirmDelete({
  title,
  description,
  onConfirm,
  trigger,
  destructiveLabel = "Hapus",
}: ConfirmDeleteProps) {
  return (
    <AlertDialog>
      {/* @ts-ignore */}
      <AlertDialogTrigger render={trigger} nativeButton={false} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {destructiveLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
