'use client'
import { usePathname } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className="pt-3 pb-5 px-5  w-full flex justify-between items-center" >
        <div className="font-semibold text-[14px] sm:text-xl md:text-2xl uppercase">Task Manager</div>

        <div className="flex items-center gap-x-3">
        <Link href="/" className={`${pathname === "/" ? "text-blue-500" : "text-gray-500"} hover:text-blue-700  text-[10px] md:text-sm`}>Create Task</Link>
        <div className="text-gray-400">|</div>
        <Link href="/taskList" className={`${pathname === "/taskList" ? "text-blue-500" : "text-gray-500"} hover:text-blue-700 text-[10px] md:text-sm`}>All Tasks</Link>
        </div>
    </div>
  )
}

export default Navbar