"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ErrorDialog({ isOpen, onClose, title, message }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-red-600">{title || "Error"}</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full hover:bg-red-50">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-gray-700 text-center">{message}</p>
          </div>
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
