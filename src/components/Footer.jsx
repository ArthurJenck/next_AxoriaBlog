import Link from "next/link"
import React from "react"

export const Footer = () => {
    return (
        <footer className="text-center bg-white p-4 border-t border-t-zinc-300">
            <Link href="#" className="font-medium">
                Axoria – All rights reserved
            </Link>
        </footer>
    )
}
